import Ember from 'ember';

/**
 * @typedef {Object} Answer
 */
export default Ember.Object.extend({

  /**
   * if the value should not be shuffled
   * @property {boolean} fixed
   */
  fixed: null,

  /**
   * Text to show when showing the question
   * @property {string} text
   */
  text: null,

  /**
   * Value to check with the correct response
   * @property {string} value
   */
  value: null

});
