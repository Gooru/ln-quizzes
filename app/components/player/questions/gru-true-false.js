import Ember from 'ember';
import QuestionComponent from './gru-question';

/**
 * True or false Question
 * Component responsible for controlling the logic and appearance of a true
 * or false question inside of the {@link player/gru-question-viewer.js}
 * @module
 * @see controllers/player.js
 * @see components/player/gru-question-viewer.js
 * @augments ember/Component
 */
export default QuestionComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames:['gru-true-false'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * When the user changes the answer choice selection
     * @param {number} answerId
     * @param {boolean} onLoad if this was called when loading the component
     */
    selectAnswerChoice: function(answerId, onLoad) {
      const component = this;
      component.notifyAnswerChanged(answerId);
      if(onLoad) {
        component.notifyAnswerLoaded(answerId);
      } else {
        component.notifyAnswerCompleted(answerId);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    if(this.get('hasUserAnswer')) {
      this.actions.selectAnswerChoice.call(this, this.get('userAnswer'), true);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Returns the 'false' answer id
   */
  falseAnswerId: Ember.computed('question.answers', function() {
    let answers = this.get('question.answers');
    let found = answers.filterBy('text', 'False');
    return found ? found.get('firstObject.id') : 'true'; //TODO, is this a data problem?
  }),

  /**
   * Returns the 'true' answer id
   */
  trueAnswerId: Ember.computed('question.answers', function() {
    let answers = this.get('question.answers');
    let found = answers.filterBy('text', 'True');
    return found ? found.get('firstObject.id') : 'true'; //TODO, is this a data problem?
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

});
