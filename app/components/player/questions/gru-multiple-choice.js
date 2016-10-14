import QuestionComponent from './gru-question';
/**
 * Multiple Choice Question
 *
 * Component responsible for controlling the logic and appearance of a multiple
 * choice question inside of the {@link player/gru-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/gru-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames:['gru-multiple-choice'],

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
    if(this.get('userAnswer')) {
      this.actions.selectAnswerChoice.call(this, this.get('userAnswer'), true);
    }
  }


  // -------------------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

});
