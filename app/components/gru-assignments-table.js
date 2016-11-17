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
      let assigned = assignment.get('assignees');
      let assignedStudents = [];
      let students = [];
      if(assigned){
        assignedStudents = assigned.getEach('id');
        if(this.get('studentList')){
          students = this.get('studentList').map(function(student) {
            let studentObject = Profile.create(student);
            studentObject.set('isAssigned',assignedStudents.includes(student.id));
            return studentObject;
          });
        }
      }
      this.set('students', students);

      let model = {
        students: this.get('students'),
        collection: assignment
      };
      this.actions.showModal.call(this, 'gru-assign-student-modal',
        model, null, null, null, false);
    },

    /**
     * Redirect to real time
     */
    openRealTime: function (assignment) {
      this.get('router').transitionTo('reports.context', assignment.get('id'));
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
   * @property {Number} the calculated resource content table height
   */
  calculatedTableContentHeight: null,

  /**
   * @property {Boolean} Indicate if is a teacher view
   * @see gru-assignments-list and assignments.js route
   */
  isTeacher: false,

  /**
   * @property {Array} Students list
   */
  students: [],
  /**
   * @property {Array} Total student list
   */
  studentList:[],

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
    var contentHeight = $('.ember-view').parent().outerHeight(true) -
      $('.table-fixed thead ').height() - $('.search').height();
    this.set('calculatedTableContentHeight', contentHeight);
  },

  /**
   * Set assignment as selected
   */
  selectAssignment: function(assignment) {
    this.unSelectAssignment();
    assignment.set('selected',true);
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
