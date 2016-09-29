import Ember from 'ember';
import AccordionMixin from 'quizzes/mixins/gru-accordion';

// Whenever the observer 'parsedLocationChanged' is running, this flag is set so
// clicking on the lessons should not update the location
var isUpdatingLocation = false;

/**
 * Accordion Lesson
 *
 * Component responsible for behaving as an accordion and listing a set of collections/assessments.
 * It is meant to be used inside of an {@link ./gru-accordion-course|Accordion Unit}
 *
 * @module
 * @augments Ember/Component
 * @mixes mixins/gru-accordion
 */
export default Ember.Component.extend(AccordionMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:session
   */
  session: Ember.inject.service("session"),

  /**
   * @requires service:api-sdk/collection
   */
  collectionService: Ember.inject.service("api-sdk/collection"),

  /**
   * @requires service:api-sdk/course-location
   */
  courseLocationService: Ember.inject.service("api-sdk/course-location"),

  /**
   * @requires service:api-sdk/performance
   */
  performanceService: Ember.inject.service("api-sdk/performance"),

  /**
   * @requires service:api-sdk/lesson
   */
  lessonService:  Ember.inject.service("api-sdk/lesson"),

  /**
   * @requires service:api-sdk/analytics
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  /**
   * @requires service:api-sdk/profile
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @requires service:api-sdk/assessment
   */
  assessmentService: Ember.inject.service("api-sdk/assessment"),

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['gru-accordion-lesson', 'panel', 'panel-default'],

  classNameBindings:['isExpanded:expanded'],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * Load the data for this lesson (data should only be loaded once) and trigger
     * the 'onLessonUpdate' event handler
     *
     * @function actions:selectLesson
     * @returns {undefined}
     */
    selectLesson: function (lessonId) {
      if (!isUpdatingLocation) {
        let updateValue = this.get('isExpanded') ? '' : lessonId;
        this.get('onSelectLesson')(updateValue);
      } else if(!this.get('isExpanded')) {
        this.loadData();
      }
    },

    /**
     * @function actions:selectResource
     * @param {string} collection - (collection/assessment)
     */
    selectResource: function (collection) {
      let lessonId = this.get("model.id");
      this.get('onSelectResource')(lessonId, collection);
    },

    setOnAir: function (collectionId) {
      this.get('onLaunchOnAir')(collectionId);
    }
  },

  // -------------------------------------------------------------------------
  // Events
  setupComponent: Ember.on('didInsertElement', function () {
    const component = this;

    this.$().on('hide.bs.collapse', function(e) {
      e.stopPropagation();
      component.set('isExpanded', false);
    });

    this.$().on('show.bs.collapse', function(e) {
      e.stopPropagation();
      component.set('isExpanded', true);
    });

    Ember.run.scheduleOnce('afterRender', this, this.parsedLocationChanged);
  }),

  didRender: function(){
    this.$('[data-toggle="tooltip"]').tooltip();


  },

  removeSubscriptions: Ember.on('willDestroyElement', function() {
    this.$().off('hide.bs.collapse');
    this.$().off('show.bs.collapse');
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {String[]} parsedLocation - Location the user has navigated to
   * parsedLocation[0] - unitId
   * parsedLocation[1] - lessonId
   * parsedLocation[2] - resourceId
   */
  parsedLocation: [],

  /**
   * @prop {String} - Id of the unit this lesson belongs to
   */
  unitId: null,

  /**
   * Contains only visible units
   * @property {Unit[]} units
   */
  collections: null,

  /**
   * @prop {String} userLocation - Location of a user in a course
   */
  userLocation: null,

  /**
   * @prop {Ember.RSVP.Promise} usersLocation - Users enrolled in the course
   * Will resolve to {Location[]}
   */
  usersLocation: Ember.A([]),

  /**
   * Indicates the status of the spinner
   * @property {Boolean}
   */
  loading: false,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observe when the 'items' promise has resolved and proceed to add the
   * corresponding users information (coming from a separate service) to each
   * one of the items so they are resolved in one single loop in the template.
   */
  addUsersToItems: Ember.observer('items', 'usersLocation', function() {
    if (this.get('items.length')) {
      let component = this;
      let visibleItems = this.get('items');
      let usersLocation = component.get("usersLocation");
      visibleItems.forEach((item) => {
        // Get the users for a specific lesson
        let entity = usersLocation.findBy('collection', item.get('id'));
        if (entity) {
          entity.get('locationUsers').then((locationUsers) => {
            item.set('users', locationUsers);
          });
        }
      });
    }
  }),

  /**
   * Observe changes to 'parsedLocation' to update the accordion's status
   * (expanded/collapsed).
   */
  parsedLocationChanged: Ember.observer('parsedLocation.[]', function () {
    const parsedLocation = this.get('parsedLocation');
    if (parsedLocation) {
      isUpdatingLocation = true;
      let lessonId = parsedLocation[1];
      this.updateAccordionById(lessonId);
      isUpdatingLocation = false;
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Load the collections for the lesson
   *
   * @function
   * @returns {undefined}
   */
  loadData: function() {
    const component = this;
    const userId = component.get('session.userId');
    const classId = component.get('currentClass.id');
    const courseId = component.get('currentClass.courseId');
    const unitId = component.get('unitId');
    const lessonId = component.get('model.id');
    const classMembers = component.get('classMembers');
    const isTeacher = component.get('isTeacher');

    component.set("loading", true);
    component.get('lessonService').fetchById(courseId, unitId, lessonId)
      .then(function(lesson) {
        const assessments = lesson.get('children');
        component.get('analyticsService').getLessonPeers(classId, courseId, unitId, lessonId)
          .then(function(lessonPeers) {
            const loadDataPromise = isTeacher ?
              component.loadTeacherData(classId, courseId, unitId, lessonId, classMembers, lessonPeers, assessments) :
              component.loadStudentData(userId, classId, courseId, unitId, lessonId, classMembers, lessonPeers, assessments);
            loadDataPromise.then(function() {
              component.set('items', assessments);
              component.set("loading", false);
            });
          });
      });
  },

  loadTeacherData: function(classId, courseId, unitId, lessonId, classMembers, lessonPeers, collections) {
    const component = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      component.get('performanceService')
        .findClassPerformanceByUnitAndLesson(classId, courseId, unitId, lessonId, classMembers)
        .then(function(performance) {

          const promises = collections.map(function(collection) {
            const isAssessment = collection.get('format') === 'assessment';
            const collectionId = collection.get('id');
            const peer = lessonPeers.findBy('id', collectionId);

            const assessmentDataPromise = isAssessment ?
              component.get('assessmentService').readAssessment(collectionId):
              Ember.RSVP.resolve(true);

            return assessmentDataPromise.then(function(assessmentData){
              if (peer) {
                return component.get('profileService').readMultipleProfiles(peer.get('peerIds'))
                  .then(function(profiles) {
                    collection.set('members', profiles);
                    const averageScore = performance.calculateAverageScoreByItem(collectionId);
                    collection.set('performance', Ember.Object.create({
                      score: averageScore,
                      hasStarted: averageScore > 0,
                      isDisabled: isAssessment ? !assessmentData.get('classroom_play_enabled') : undefined
                    }));
                  });
              }
              else {
                collection.set('performance', Ember.Object.create({
                  isDisabled: isAssessment ? !assessmentData.get('classroom_play_enabled') : undefined
                }));
                return Ember.RSVP.resolve(true);
              }
            });
          });
          Ember.RSVP.all(promises).then(resolve, reject);
        });
    });
  },

  loadStudentData: function(userId, classId, courseId, unitId, lessonId, classMembers, lessonPeers, collections) {
    const component = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const classMinScore = component.get('currentClass.minScore');
      component.get('performanceService')
        .findStudentPerformanceByLesson(userId, classId, courseId, unitId, lessonId, collections)
        .then(function(performance) {
          const promises = collections.map(function(collection) {
            const isAssessment = collection.get('format') === 'assessment';
            const peer = lessonPeers.findBy('id', collection.get('id'));
            if (peer) {
              component.get('profileService').readMultipleProfiles(peer.get('peerIds'))
                .then(function (profiles) {
                  collection.set('members', profiles);
                });
            }
            const collectionPerformanceData = performance.findBy('id', collection.get('id'));
            const score = collectionPerformanceData.get('score');
            const hasTrophy = (score && score > 0 && classMinScore && score >= classMinScore);
            collectionPerformanceData.set('hasTrophy', hasTrophy);
            collection.set('performance', collectionPerformanceData);
            const attempts = collectionPerformanceData.get('attempts');
            if(isAssessment) {
              return component.get('assessmentService').readAssessment(collection.get('id'))
                .then(function (assessment) {
                  const attemptsSettings = assessment.get('attempts');
                  if (attemptsSettings) {
                    const noMoreAttempts = attempts && attemptsSettings > 0 && attempts >= attemptsSettings;
                    collectionPerformanceData.set('noMoreAttempts', noMoreAttempts);
                    collectionPerformanceData.set('isDisabled', !assessment.get('classroom_play_enabled'));
                  }
                });
            } else {
              return Ember.RSVP.resolve(true);
            }
          });
          Ember.RSVP.all(promises).then(resolve, reject);
        });
    });
  }

});
