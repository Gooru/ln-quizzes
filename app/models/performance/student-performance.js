import Ember from 'ember';
import DS from 'ember-data';

/**
 * Model that contains the student performance data by unit, lesson or collection|assessment.
 * @typedef {Object} StudentPerformance
 */
export default DS.Model.extend({

  /**
   * @property {User} user
   */
  user: DS.belongsTo("user/user", { async: false }),

  /**
   * @property {Performance[]} List of Performance items.
   */
  performanceData: DS.hasMany('performance/performance', { async: false }),

  /**
   * @property {Number} Computed property with the average score for all student data.
   */
  averageScore: Ember.computed('performanceData', function() {
    return this.calculateAverage('score');
  }),

  /**
   * @property {Number} Computed property with the average time spent for all student data.
   */
  averageTimeSpent: Ember.computed('performanceData', function() {
    return this.calculateAverage('timeSpent');
  }),

  /**
   * @property {Number} Computed property with the summatory of completion done for all student data.
   */
  sumCompletionDone: Ember.computed('performanceData', function() {
    return this.calculateSum('completionDone');
  }),

  /**
   * @property {Number} Computed property with the summatory of completion total for all student data.
   */
  sumCompletionTotal: Ember.computed('performanceData', function() {
    return this.calculateSum('completionTotal');
  }),

  /**
   * Helper function to calculate the average value of a specific field.
   * @param fieldName the field to calculate
   * @returns {number} the average value
   */
  calculateAverage: function(fieldName) {
    var avgValue = -1;
    const counter = this.get('performanceData').length;
    if (counter > 0) {
      avgValue = this.calculateSum(fieldName) / counter;
    }
    return avgValue;
  },

  /**
   * Helper function to calculate the summatory value of a specific field.
   * @param fieldName the field to calculate
   * @returns {number} the summatory value
   */
  calculateSum: function(fieldName) {
    var sumValue = 0;
    const performanceData = this.get('performanceData');
    if (performanceData.length > 0) {
      performanceData.forEach(function(performance) {
        sumValue += performance.get(fieldName);
      });
    }
    return sumValue;
  }

});
