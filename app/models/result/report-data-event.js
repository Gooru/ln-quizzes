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
   * @property {Number} averageReaction averaged student's reactions
   */
  averageReaction: 0,

  /**
   * @property {Number} averageScore calculated student score
   */
  averageScore: 0,

  /**
   * @property {string} currentResourceId
   */
  currentResourceId: null,

  /**
   * @property {boolean} isAttemptStarted - if the user started the attempt
   */
  isAttemptStarted: true,

  /**
   * @property {boolean} isAttemptFinished - if the user finished the attempt
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
  profileCode: Ember.computed('profileId', function() {
    return this.get('profileId').slice(0, 4);
  }),

  /**
   * @property {string} profileName student's name
   */
  profileName: null,

  /**
   * @property {Number} totalAnswered total number of answered questions
   */
  totalAnswered: 0,

  /**
   * @property {Number} totalCorrect total number of correct answers
   */
  totalCorrect: 0,

  /**
   * @property {Number} totalIncorrect total number of incorrect answers
   */
  totalIncorrect: Ember.computed('totalAnswered', 'totalCorrect', function() {
    return this.get('totalAnswered') - this.get('totalCorrect');
  }),

  /**
   * @property {Number} totalTimeSpent summarized time spent
   */
  totalTimeSpent: 0,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Set summary properties coming from web sockets events
   */
  clearProfileSummary: function() {
    this.set('isAttemptFinished', false);
    this.set('totalAnswered', 0);
    this.set('totalCorrect', 0);
    this.set('averageReaction', 0);
    this.set('averageScore', 0);
    this.set('totalTimeSpent', 0);
  },

  /**
   * Find a resource's index by its id
   */
  findIndexByResourceId: function(resourceId) {
    return this.get('resourceResults').reduce(
      (index, result, current) =>
        result.get('resourceId') === resourceId ? current : index,
      -1);
  },

  /**
   * Merge a new result with the corresponding resource result
   */
  merge: function(resourceId, newResult) {
    let index = this.findIndexByResourceId(resourceId);
    newResult.savedTime = newResult.savedTime || newResult.timeSpent;
    this.get('resourceResults').get(index).setProperties({
      resourceId: newResult.resourceId,
      savedTime: newResult.savedTime,
      stopTime: 0,
      startTime: 0,
      reaction: newResult.reaction,
      answer: newResult.answer,
      score: newResult.score
    });
  },

  /**
   * Set properties coming from the profile
   */
  setProfileProperties: function(profile) {
    this.set('profileName', profile.get('fullName'));
  },

  /**
   * Set summary properties coming from web sockets events
   */
  setProfileSummary: function(summary, isAttemptFinished) {
    this.set('isAttemptFinished', isAttemptFinished);
    this.set('totalAnswered', summary.totalAnswered);
    this.set('totalCorrect', summary.totalCorrect);
    this.set('averageReaction', summary.averageReaction);
    this.set('averageScore', summary.averageScore);
    this.set('totalTimeSpent', summary.totalTimeSpent);
  }

});
