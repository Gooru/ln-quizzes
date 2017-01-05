import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';
import Profile from 'quizzes/models/profile/profile';
import { getGradeColor } from 'quizzes/utils/utils';

export default Ember.Component.extend(ModalMixin,{
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-detail'],

  // -------------------------------------------------------------------------
  // Actions

  actions:{
    /**
     * Open add student modal
     */
    addStudent: function () {
      let assigned = this.get('assignment.assignees');
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
        assignment: this.get('assignment'),
        width:'95%'
      };
      this.actions.showModal.call(this, 'gru-assign-student-modal',
        model, null, null, null, false);
    },

    /**
     * Redirect to real time
     */
    openRealTime: function () {
      if(this.get('realTimeURL')){
        let url = this.get('realTimeURL').replace('{context-id}', this.get('assignment.id'));
        window.location.href = url;
      } else {
        this.get('router').transitionTo('reports.context', this.get('assignment.id'));
      }
    },
    /**
     * Open player
     */
    openPlayer:function(assignment){
      if(this.get('playerURL')){
        let url = this.get('playerURL').replace('{context-id}', assignment.get('id'));
        window.location.href = url;
      } else {
        this.get('router').transitionTo('player', assignment.get('id'));
      }
    },
    /**
     * View Report
     */
    viewReport: function (assignment) {
      Ember.Logger.log('View Report:', assignment);
    }
  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * Assignment to show
   */
  assignment: null,

  /**
   *Indicate if the assignment has attempts left
   */
  hasAttempts: Ember.computed('assignment.attempts', 'assignment.totalAttempts',
    function() {
      return this.get('assignment.totalAttempts') - this.get('assignment.attempts') > 0;
    }
  ),

  /**
   * @property {Boolean} Indicate if is a teacher view
   * @see gru-assignments-list and assignments.js route
   */
  isTeacher: false,

  /**
   * @property {String} scoreStyle style safe string for the score span
   */
  scoreStyle: Ember.computed('assignment.score', function() {
    const color = getGradeColor(this.get('assignment.score') || 'NA');
    return Ember.String.htmlSafe(`background-color: ${color}`);
  }),

  /**
   * @property {Array} Students list
   */
  students: null

});
