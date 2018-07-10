import Ember from 'ember';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-player-confirmation'],

  // -------------------------------------------------------------------------
  // Service

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection|assessment
   */
  collectionService: Ember.inject.service('quizzes/collection'),

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    const component = this;
    component.fetchConfirmationInfo();
  },

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    //Action triggered when click on the start
    start() {
      this.sendAction('onStartPlayer');
    },

    //Action triggered when click on the cancel
    cancel() {
      let component = this;
      let transitionTo = 'course-map';
      component.sendAction('onClosePlayer', transitionTo);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {number} currentAttempts
   */
  attempts: null,

  attemptsLeft: Ember.computed('attempts', 'collection.attempts', function() {
    return this.get('collection.attempts') - this.get('attempts');
  }),

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {Context} context
   */
  context: null,

  /**
   * @property {boolean} flag for determining button behaviour
   */
  disableStart: Ember.computed('unlimited', 'noMoreAttempts', function() {
    return !this.get('unlimited') && this.get('noMoreAttempts');
  }),

  /**
   * @property {Boolean} Indicate if the context has more attempts available
   */
  noMoreAttempts: Ember.computed(
    'collection.isAssessment',
    'collection.attempts',
    'attempts',
    function() {
      return (
        this.get('collection.isAssessment') &&
        this.get('collection.attempts') > 0 &&
        this.get('attempts') &&
        this.get('attempts') >= this.get('collection.attempts')
      );
    }
  ),
  /**
   * @property {boolean} flag for determining unlimited behaviour
   */
  unlimited: Ember.computed.equal('collection.attempts', -1),

  isCollectionConfirmation: Ember.computed('collection', function() {
    let component = this;
    return component.get('collection.isCollection');
  }),

  /**
   * @property {Boolean}
   * Is suggested content
   */
  isSuggestedContent: Ember.computed('collectionSubType', function() {
    let component = this;
    return !!component.get('collectionSubType');
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('confirmationInfo', function() {
    let standards = this.get('confirmationInfo.taxonomy');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function fetchConfirmationInfo
   * Method to fetch confirmation info data
   */
  fetchConfirmationInfo() {
    let component = this;
    let collection = component.get('collection');
    let isCollectionConfirmation = component.get('isCollectionConfirmation');
    if (isCollectionConfirmation) {
      component.getCollection(collection.id).then(function(collectionInfo) {
        let contentCount = component.getResourceQuestionCount(
          collection.resources
        );
        collectionInfo.questionCount = contentCount.questionCount;
        collectionInfo.resourceCount = contentCount.resourceCount;
        component.set('confirmationInfo', collectionInfo);
      });
    } else {
      component.getAssessment(collection.id).then(function(assessmentInfo) {
        component.set('confirmationInfo', assessmentInfo);
      });
    }
  },

  /**
   * @function getCollection
   * Get a collection by Id
   */
  getCollection(collectionId) {
    const component = this;
    const collectionPromise = Ember.RSVP.resolve(
      component.get('collectionService').getCollection(collectionId)
    );
    return Ember.RSVP
      .hash({
        collection: collectionPromise
      })
      .then(function(hash) {
        return hash.collection;
      });
  },

  /**
   * @function getAssessment
   * Get an assessment by Id
   */
  getAssessment(assessmentId) {
    const component = this;
    const assessmentPromise = Ember.RSVP.resolve(
      component.get('collectionService').getAssessment(assessmentId)
    );
    return Ember.RSVP
      .hash({
        assessment: assessmentPromise
      })
      .then(function(hash) {
        return hash.assessment;
      });
  },

  /**
   * @function getResourceQuestionCount
   * Method to get resource and question count from the collection
   */
  getResourceQuestionCount(resources) {
    let questionCount = 0;
    let resourceCount = 0;
    if (Ember.isArray(resources)) {
      resources.map(resource => {
        if (resource.isResource) {
          resourceCount++;
        } else {
          questionCount++;
        }
      });
    }
    return {
      questionCount,
      resourceCount
    };
  }
});
