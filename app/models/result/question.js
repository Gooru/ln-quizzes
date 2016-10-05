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
     * @property {number} isQuestion
     */
    isQuestion: true,

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
    score: 0
});
