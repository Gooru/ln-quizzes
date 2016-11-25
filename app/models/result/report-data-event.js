import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';

/**
 * Profile results/events by resource
 *
 * @typedef {Object} ReportDataEvent
 *
 */
export default Ember.Object.extend({

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} currentResourceId
   */
  currentResourceId: null,

  /**
   * @property {boolean} isAttemptStarted - is the user starting a new attempt?
   */
  isAttemptStarted: false,

  /**
   * @property {boolean} isAttemptFinished - is the user finishing the current attempt?
   */
  isAttemptFinished: false,

  /**
   * @property {QuestionResult[]} questionResults
   */
  questionResults: Ember.computed('resourceResults.[]', function () {
    return this.get('resourceResults')
      .filter(resourceResult => resourceResult instanceof QuestionResult);
  }),

  /**
   * @property {ResourceResult[]} questionResults
   */
  resourceResults: Ember.A(),

  /**
   * @property {string} profileId student's id
   */
  profileId: null,

  /**
   * @property {string} profileCode student's anonymous code
   */
  profileCode: null,

  /**
   * @property {string} profileName student's name
   */
  profileName: null

});
