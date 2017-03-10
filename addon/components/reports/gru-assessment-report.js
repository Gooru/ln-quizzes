import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Handle event triggered by gru-summary
     * Scroll to specific question
     * TODO make this method generic
     */
    bubbleSelect: function(bubbleOption) {
      const animationSpeed = 1000;  // milliseconds
      const selectorTable = $(`.gru-assessment-report .gru-questions table:visible tbody tr:nth-child(${bubbleOption.label})`);
      const $elTable = $(selectorTable);

      const selectorList = $(`.gru-assessment-report .gru-questions .question-cards-list:visible li:nth-child(${bubbleOption.label}) .question-card`);
      const $elList = $(selectorList);

      const isModal=$('.gru-assessment-report').parents('.qz-modal');
      //Check if the assessment report is showing into a modal
      if(isModal.length){
        if ($elTable.length) {
          $('.qz-modal').animate({
            scrollTop: $elTable.offset().top -   $('.qz-modal').offset().top
          }, animationSpeed);
        }
      }else{
        //Check if the questions details are showing on table (md or sm devices) or  a list (xs devices)
        if ($elTable.length) {
          $('html,body').animate({
            scrollTop: $elTable.offset().top - $('.controller.class.analytics.collection.student').offset().top
          }, animationSpeed);
        } else if ($elList.length) {
          $('html,body').animate({
            scrollTop: $elList.offset().top - $('.controller.class.analytics.collection.student').offset().top
          }, animationSpeed);
        } else {
          Ember.Logger.error(`No element was found for selectorTable: ${selectorTable}`);
        }
      }
    },

    selectAttempt: function(attempt){
      this.sendAction('onSelectAttempt', attempt);
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'gru-assessment-report'],


  // -------------------------------------------------------------------------
  // Events
  /**
   * Listening for model to update component properties
   */
  onInit: Ember.on('init', function() {
    if (this.get('model')){
      this.set('contextResult', this.get('model').contextResult);
    }
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ContextResult} assessment
   */
  contextResult: null,

  /**
   * @property {boolean} areAnswersHidden - Should answer results be hidden?
   */
  areAnswersHidden: false,

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: false,

  /**
   * @property {string} on select attempt action name
   */
  onSelectAttempt: null,

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: Ember.computed('model', function(){
    return this.get('model.contextResult.isRealTime');
  }),

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: Ember.computed('model', function(){
    return this.get('model.contextResult.showAttempts') !== undefined ? this.get('model.contextResult.showAttempts') : true;
  }),

  /**
   * Return ordered questions array
   * @return {Ember.Array}
   */
  orderedQuestions: Ember.computed('contextResult.questionResults.@each.updated', function() {
    return this.get('contextResult.questionResults').sort(
      (a, b) => a.get('question.sequence') - b.get('question.sequence'));
  })
});
