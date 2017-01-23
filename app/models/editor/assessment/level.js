import Ember from 'ember';

/**
 * Level model
 * typedef {Object} Level
 */
export default Ember.Object.extend({
  /**
   * @property {string} id
   */
  id:'',
  /**
   * @property {string} Description
   */
  description:'',
  /**
   * @property {Integer} Points
   */
  points:0
});
