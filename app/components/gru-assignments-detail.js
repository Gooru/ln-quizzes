import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';
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

  willDestroyElement: function() {
    window.onresize = null;
  },
  // -------------------------------------------------------------------------
  // Actions

  actions:{
    /**
     * Open add student modal
     */
    addStudent: function () {
      let model = {
        students: this.get('students'),
        collection: this.get('assignment'),
        width:'75%'
      };
      this.actions.showModal.call(this, 'gru-assign-student-modal',
        model, null, null, null, false);
    },

    /**
     * Redirect to real time
     */
    openRealTime: function () {
      this.get('router').transitionTo(
        'reports.context', this.get('assignment.id'));
    }
  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * Assignment to show
   */
  assignment: null,

  /**
   * @property {Number} the calculated resource content table height
   */
  calculatedContentHeight: null,

  /**
   *Return the table content height to print on inline styles
   */
  contentHeight: Ember.computed('calculatedContentHeight', function() {
    var height = this.get('calculatedContentHeight');
    const heightString = height > 0 && height >= 400 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(`max-height: ${heightString}`);
  }),

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
  students: null,

  // -------------------------------------------------------------------------
  // Methods
  /**
   *Calculate the height of the content
   */
  calculateHeight: function() {
    var contentHeight = $('.ember-view').parent().outerHeight(true) -
      $('.table-fixed thead ').height() - $('.search').height();
    this.set('calculatedContentHeight', contentHeight);
  }

});
