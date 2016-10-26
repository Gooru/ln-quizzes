import Ember from 'ember';
import Serializable from 'quizzes/mixins/serializable';

/**
 * Model for the status of a resource after it has been viewed by a user.
 *
 * @typedef {Object} ResourceResult
 *
 */
export default Ember.Object.extend(Serializable, {

  /**
   * @property {number} reaction - user reaction to the resource
   */
  reaction: 0,

  /**
   * @property {number} resource - the resource
   */
  resource: null,

  /**
   * @property {number} resourceId - ID of the resource
   */
  resourceId: null,

  /**
   * @property {number} isQuestion
   */
  isQuestion: false,

  /**
   * @property {number} timeSpent - Time spent in this resource
   */
  timeSpent: 0

});
