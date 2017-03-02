import Ember from 'ember';
import ContextResult from 'quizzes-addon/models/result/context';

export default Ember.Component.extend({

  classNames: ['reports', 'qz-student-report'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ReportDataEvent} attemptData all data for the current/last attempt
   */
   attemptData: null,

   /**
    * @property {ContextResult} contextResult data normalized for report
    */
  contextResult: Ember.computed('attemptData', function() {
    return ContextResult.create({
      reportEvent: this.get('attemptData'),
      averageReaction: Ember.computed.alias('reportEvent.averageReaction'),
      correctPercentage: Ember.computed.alias('reportEvent.averageScore'),
      correctAnswers: Ember.computed.alias('reportEvent.totalCorrect'),
      currentResourceId: Ember.computed.alias('reportEvent.currentResourceId'),
      totalTimeSpent: Ember.computed.alias('reportEvent.totalTimeSpent'),
      totalAttempts: 1,
      selectedAttempt: 1,
      resourceResults: Ember.computed.alias('reportEvent.resourceResults'),
      collection: this.get('collection'),
      isRealTime: this.get('isRealTime'),
      showAttempts: this.get('showAttempts')
    });
  }),

  /**
   * @property {Collection} collection
   */
  collection: Ember.computed.alias('attemptData.collection'),

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: true,

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: false,

  /**
   * @property {Number} totalAttempts
   */
   totalAttempts: 0
});
