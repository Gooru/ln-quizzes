import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';
import Profile from 'quizzes/models/profile/profile';

export default Ember.Component.extend(ModalMixin,{
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),
  /**
   * @property {Service} profile service
   */
  profileService: Ember.inject.service("api-sdk/profile"),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-table'],


  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Open add student modal
     */
    addStudent: function (assignment) {
      const component = this;
      let students = [];
      let promises =  assignment.get('assignees').map(assignee => assignee.id ?
          component.get('profileService').readProfile(assignee.id) : { externalId: assignee.externalId, id: '' }
      );
      Ember.RSVP.all(promises).then(function(profiles) {
        let profilesMap = profiles.reduce(function(profilesObj, profile) {
          profilesObj[profile.externalId] = {
            externalId: profile.externalId,
            id: profile.id
          };
          return profilesObj;
        }, {});

        if(profilesMap){
          if(component.get('studentList')){
            students = component.get('studentList').map(function(student) {
              let studentObject = Profile.create(student);
              let actualStudent = profilesMap[student.externalId];
              studentObject.set('isAssigned', !!actualStudent);
              studentObject.set('id',  actualStudent ? actualStudent.id : '');
              return studentObject;
            });
          }
        }
        component.set('students', students);

        let model = {
          students: component.get('students'),
          assignment,
          width:'75%',
          callback:{
            success: assignment => component.sendAction('onUpdateAssignment', assignment)
          }
        };
        component.actions.showModal.call(component, 'gru-assign-student-modal',
          model, null, null, null, false);
      });
    },
    /**
     * Open slide up actions
     */
    openActions:function(assignment){
      this.set('actualAssignment',assignment);
      this.set('showMenu',true);
    },

    /**
     * Redirect to real time
     */
    openRealTime: function (assignment) {
      this.get('router').transitionTo('reports.context', assignment.get('id'));
    },

    /**
     * Open player
     */
    openPlayer:function(assignment){
      this.get('router').transitionTo('player', assignment.get('id'));
    },

    /***
     * Search assignment
     */
    selectAssignment: function (assignment) {
      this.selectAssignment(assignment);
      this.sendAction('onSelectAssignment', assignment);
    },

    /**
     * Sort assignment list
     */
    sortBy: function(criteria) {
      if(criteria === this.get('sortBy')) {
        this.set('reverseSort', !this.get('reverseSort'));
      } else {
        this.set('sortBy', criteria);
        this.set('reverseSort', false);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    const component = this;

    component.calculateHeight();

    window.onresize = function() {
      component.calculateHeight();
    };

  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Context} selected assigment
   */
  actualAssignment:null,
  /**
   * @property {Number} the calculated resource content table height
   */
  calculatedTableContentHeight: null,

  /**
   * @property {Boolean} Indicate if is a teacher view
   * @see gru-assignments-list and assignments.js route
   */
  isTeacher: false,

  /**
   * Return menu mobile options
   */
  optionsMobile: Ember.computed('actualAssignment','isTeacher', function () {
   let options;
    if(this.get('isTeacher')){
      options = this.teacherOptions(this.get('actualAssignment'));
    }else{
      //TODO STUDENT VIEW OPTIONS
    }
    return options;
  }),

  /**
   * @property {Array} Students list
   */
  students: [],

  /**
   * @property {Array} Total student list
   */
  studentList:[],

  /**
   *  @property {Boolean} show actions menu
   */
  showMenu:false,

  /**
   *Return the table content height to print on inline styles
   */
  tableContentHeight: Ember.computed('calculatedTableContentHeight', function() {
    var height = this.get('calculatedTableContentHeight');
    const heightString = height > 0 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(`max-height: ${heightString}`);
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   *Calculate the height of the content
   */
  calculateHeight: function() {
    let height = $('.ember-view').parent().outerHeight(true) > window.outerHeight ?
      window.outerHeight : $('.ember-view').parent().outerHeight(true)
    - $('.table-fixed thead ').height() - $('.search').height();
    this.set('calculatedTableContentHeight', height);
  },

  /**
   * Set assignment as selected
   */
  selectAssignment: function(assignment) {
    this.unSelectAssignment();
    assignment.set('selected',true);
  },
  /**
   * Return the teacher options for mobile menu
   */
  teacherOptions:function(assignment){
    return Ember.A([Ember.Object.create({
      option:'launch',
      action:'onLaunch',
      object:assignment
    }),Ember.Object.create({
      option:'assign',
      action:'onAssign',
      object:assignment
    }),Ember.Object.create({
      option:'preview',
      action:'onPreview',
      object:assignment
    })]);
  },

  /**
   * Unselected assignment
   */
  unSelectAssignment: function() {
    var selectedAssignment = this.get('assignments').findBy('selected',true);
    if(selectedAssignment){
      selectedAssignment.set('selected',false);
    }
  }
});
