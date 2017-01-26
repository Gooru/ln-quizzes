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
   * @property {boolean} isQuestion
   */
  isQuestion: false,

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
   * @property {number} savedTime - Current loaded time for the resource
   */
  savedTime: 0,

  /**
   * @property {number} skipped - if the resource was skipped
   */
  skipped: false,

  /**
   * @property {number} started - if the resource was started
   */
  started: true,

  /**
   * @property {number} startTime - Current start time for the resource
   */
  startTime: 0,

  /**
   * @property {number} stopTime - Current stop time for the resource
   */
  stopTime: 0,

  /**
   * @property {number} timeSpent - Time spent in this resource
   */
  timeSpent: Ember.computed('startTime', 'stopTime', 'savedTime', function() {
    let savedTime = this.get('savedTime') || 0;
    let startTime = this.get('startTime') || 0;
    let stopTime = this.get('stopTime') || startTime;
    return savedTime + (stopTime - startTime);
  }),

  /**
   * @property {Number} updated keep track of updated to redraw realtime dashboard
   */
  updated: 0,

  // -------------------------------------------------------------------------
  // Methods

  clear: function() {
    this.set('reaction', 0);
    this.set('savedTime', 0);
    this.set('startTime', 0);
    this.set('stopTime', 0);
  }

});
