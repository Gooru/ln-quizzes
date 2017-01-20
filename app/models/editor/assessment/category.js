import Ember from 'ember';

/**
 * Category model
 * typedef {Object} Category
 */
export default Ember.Object.extend({

  /**
   * @property {string} Category Title
   */
  title:'',
  /**
   * @property {string} Feedback guidance
   */
  feedbackGuidance:'',
  /**
   * @property {Boolean} Required Feedback
   */
  requiredFeedback:false
});
