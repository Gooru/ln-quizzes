import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Handle event triggered by gru-learning-target
     */
    bubbleSelect: function(bubbleOption) {
      this.sendAction('onBubbleSelect', bubbleOption);
    },

    /**
     * Handle event triggered by gru-learning-target view more option in standards
     */
    viewMore: function() {
      let component = this;
      this.set('isViewMoreEnabled', true);
      component.$('.standard-root').slideDown();
    },
    /**
     * Handle event triggered by gru-learning-target view more option show less
     */
    showLess: function() {
      this.set('isViewMoreEnabled', false);
    }
  },
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'qz-mastery'],
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {AssessmentResult} assessment
   */
  assessmentResult: null,

  /**
   * List of learning targets to be displayed by the component
   *
   * @constant {Array}
   */
  learningTargets: null,

  /**
   * List of learning targets to be displayed defult false show only one targets
   *
   * @constant {boolean}
   */

  isViewMoreEnabled: false,

  /**
   * List of learning targets should be displayed by the component
   *
   * @constant {Array}
   */
  firstLearningTarget: Ember.computed('learningTargets', function() {
    let learningTargets = this.get('learningTargets');
    return (learningTargets && learningTargets.length) > 0
      ? learningTargets.objectAt(0)
      : null;
  }),

  hasMoreLearningTargets: Ember.computed('learningTargets', function() {
    let learningTargets = this.get('learningTargets');
    return !!(learningTargets && learningTargets.length > 1);
  }),

  viewMoreLearningTargets: Ember.computed('learningTargets', function() {
    let viewMoreLearningTargets = Ember.A([]);
    if (this.get('hasMoreLearningTargets')) {
      let learningTargets = this.get('learningTargets');
      learningTargets.forEach(function(item, index) {
        if (index > 0) {
          viewMoreLearningTargets.pushObject(item);
        }
      });
    }
    return viewMoreLearningTargets;
  })
});
