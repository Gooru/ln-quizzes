import Ember from 'ember';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Handle event triggered by qz-summary
     * Scroll to specific question
     **/
    bubbleSelect: function(bubbleOption) {
      const animationSpeed = 1000; // milliseconds
      const trSelector = $(
        `.qz-assessment-report table:visible .tr-number-${bubbleOption.label}`
      );
      const cardSelector = $(
        `.qz-assessment-report ul:visible .xs-number-${bubbleOption.label}`
      );

      const $trTable = $(trSelector);
      const $card = $(cardSelector);

      const isModal = $('.qz-assessment-report').parents('.qz-modal');
      //Check if the assessment report is showing into a modal
      if (isModal.length) {
        if ($trTable.length) {
          $('.qz-modal').animate(
            {
              scrollTop: $trTable.offset().top - $('.qz-modal').offset().top
            },
            animationSpeed
          );
        }
      } else {
        //Check if the questions details are showing on table (md or sm devices) or  a list (xs devices)
        if ($trTable.length) {
          $('html,body').animate(
            {
              scrollTop:
                $($trTable).offset().top -
                $('.controller.analytics.collection.student').offset().top
            },
            animationSpeed
          );
        } else if ($card.length) {
          $('html,body').animate(
            {
              scrollTop:
                $($card).offset().top -
                $('.controller.analytics.collection.student').offset().top
            },
            animationSpeed
          );
        } else {
          Ember.Logger.error(
            `No element was found for selectorTable: ${$trTable}`
          );
        }
      }
    },

    selectAttempt: function(attempt) {
      this.sendAction('onSelectAttempt', attempt);
    },

    /**
     * Selects Performance Option or not
     * @function actions:selectPerformanceOption
     */
    selectPerformanceOption: function(showPerformance) {
      if (!this.get('isAnswerKeyHidden')) {
        this.set('showPerformance', showPerformance);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'qz-assessment-report'],

  // -------------------------------------------------------------------------
  // Events
  /**
   * Listening for model to update component properties
   */
  onInit: Ember.on('init', function() {
    if (this.get('model')) {
      this.set('contextResult', this.get('model').contextResult);
      if (this.get('model').profile) {
        this.set('profile', this.get('model').profile);
      }
    }
    this.set('selectedAttempt', this.get('contextResult.totalAttempts'));
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ContextResult} assessment
   */
  contextResult: null,

  /**
   * @property {boolean} areAnswersHidden - Should answer results be hidden?
   */
  areAnswersHidden: false,

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: false,

  /**
   * @property {string} on select attempt action name
   */
  onSelectAttempt: null,

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: Ember.computed('model.contextResult.isRealTime', function() {
    return this.get('model.contextResult.isRealTime');
  }),

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: Ember.computed('model.contextResult.showAttempts', function() {
    return (
      this.get('model.contextResult.showAttempts') === undefined ||
      this.get('model.contextResult.showAttempts')
    );
  }),

  /**
   * Return ordered questions/resources array
   * @return {Ember.Array}
   */
  orderedQuestions: Ember.computed(
    'contextResult.sortedResourceResults.@each.updated',
    function() {
      this.get('contextResult.sortedResourceResults').forEach(function(
        result,
        index
      ) {
        result.set('resource.sequence', index + 1);
      });
      return this.get('contextResult.sortedResourceResults');
    }
  ),
  /**
   * List of open ended questions to be displayed
   *
   * @constant {Array}
   */
  resultsOpenEnded: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(resourceResult =>
        resourceResult.get('isOpenEnded')
      );
    }
  ),

  /**
   * List of questions to be displayed (Not open ended)
   *
   * @constant {Array}
   */
  resultsQuestions: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(
        resourceResult =>
          resourceResult.get('isQuestion') && !resourceResult.get('isOpenEnded')
      );
    }
  ),

  /**
   * List of questions to be displayed (Not open ended)
   *
   * @constant {Array}
   */
  resultsResources: Ember.computed(
    'orderedQuestions.@each.updated',
    function() {
      return this.get('orderedQuestions').filter(resourceResult =>
        resourceResult.get('isResource')
      );
    }
  ),

  /**
   * @property {boolean} isAssessment - if collection is an Assessment
   */
  isAssessment: Ember.computed.alias('contextResult.collection.isAssessment'),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('contextResult.collection.standards.[]', function() {
    let standards = this.get('contextResult.collection.standards');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  }),

  /**
   * @property {Collection}
   */
  collection: Ember.computed.alias('contextResult.collection'),

  hasOnlyOEQuestion: Ember.computed(
    'resultsQuestions',
    'resultsResources',
    'resultsOpenEnded',
    function() {
      return (
        this.get('resultsOpenEnded.length') > 0 &&
        this.get('resultsResources.length') === 0 &&
        this.get('resultsQuestions.length') === 0
      );
    }
  ),

  hasQuestionScore: Ember.computed(
    'contextResult.reportEvent.totalAnswered',
    function() {
      return this.get('contextResult.reportEvent.totalAnswered') > 0;
    }
  ),

  /**
   * @property {number} selected attempt
   */
  selectedAttempt: null,

  /**
   * @property {[]}
   */
  attempts: Ember.computed('contextResult.totalAttempts', function() {
    return this.getAttemptList();
  }),

  /**
   * Indicate if the table show the performance columns
   *
   * @property {Boolean}
   */
  showPerformance: true,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Create list of attempts to show on the UI
   * @returns {Array}
   */
  getAttemptList: function() {
    const attempts = [];
    let totalAttempts = this.get('contextResult.totalAttempts');

    for (; totalAttempts > 0; totalAttempts--) {
      attempts.push({
        label: totalAttempts,
        value: totalAttempts
      });
    }
    return attempts;
  }
});
