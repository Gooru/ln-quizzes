import Ember from 'ember';
import {SCORES} from "gooru-web/config/config";

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-metrics-performance-information'],

  // -------------------------------------------------------------------------
  // Actions
  actions:{

  },
  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  dataPickerOptions: Ember.A(["score"]),

  /**
   * The performanceData information
   * @property {performance}
   */

  performanceData: null,

  /**
   * Show the score class
   * @property {String}
   */
  scoreClass: Ember.computed('performanceData', function() {
    var performanceDataScore = this.get('performanceData').score;
    var classScore= 'excellent';

    switch(true) {
      case (performanceDataScore < SCORES.REGULAR):
        classScore = 'bad';
        break;
      case (performanceDataScore >= SCORES.REGULAR && performanceDataScore < SCORES.GOOD):
        classScore = 'regular';
        break;
      case (performanceDataScore >= SCORES.GOOD && performanceDataScore < SCORES.VERY_GOOD):
        classScore = 'good';
        break;
      case (performanceDataScore >= SCORES.VERY_GOOD && performanceDataScore < SCORES.EXCELLENT):
        classScore = 'very-good';
        break;
    }
    return classScore;
  }),

  /**
   * If score option is selected
   * @property {Boolean}
   */
  showScore: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.contains('score');
  }),
  /**
   * If completion option is selected
   * @property {Boolean}
   */
  showCompletion: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.contains('completion');
  }),

  /**
   * If study time option is selected
   * @property {Boolean}
   */
  showStudyTime: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.contains('study-time');
  })

  // -------------------------------------------------------------------------

  // Methods

});
