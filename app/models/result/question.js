import Ember from 'ember';
import ResourceResult from './resource';

/**
 * Model for a brief summary of the status of a question after it was answered by a user.
 *
 * @typedef {Object} QuestionResult
 *
 */
export default ResourceResult.extend({

  /**
   * @property {Object} answer - Answer provided by the user
   */
  answer: null,

  /**
   * @property {boolean} correct - Was the answer provided for this question correct?
   */
  correct: Ember.computed.equal('score', 100),

  /**
   * @property {boolean} hasAnswer - if the question has an answer
   */
  hasAnswer: Ember.computed.bool('answer'),

  /**
   * @property {boolean} incorrect - Was the answer provided for this question incorrect?
   */
  incorrect: Ember.computed.not('correct'),

  /**
   * @property {number} isQuestion
   */
  isQuestion: true,

  /**
   * @property {number} resource - the question
   */
  question: Ember.computed.alias('resource'),

  /**
   * @property {number} questionId - ID of the question
   */
  questionId: Ember.computed.alias('resourceId'),

  /**
   * @property {number} reaction - user reaction to the resource
   */
  reaction: 0,

  /**
   * @property {number} score - Resource score
   */
  score: 0,

  /**
   * @property {boolean} submitted - if the question is already submitted
   */
  submitted: false
});
