import Ember from 'ember';
import QuestionComponent from 'quizzes-addon/components/player/questions/qz-question';

/**
 * Fill in the blank
 *
 * Component responsible for controlling the logic and appearance of a fill in the blank
 * question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-fib'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events
  initInputEvents: function () {
    const component = this;
    component.setAnswersEvents();
  }.on('didInsertElement'),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Replace '[]' to an input
   * @param question.body
   */
  answers: Ember.computed('question.body', function() {
    const component = this;
    let answers = component.get('question.body');
    let readOnly = component.get('readOnly');
    let disabled = readOnly ? 'disabled': '';

    if (component.get('hasUserAnswer')) {
      let userAnswer = component.get('userAnswer');
      userAnswer.forEach(function(choice){
        let input = `<input type='text' value='${choice.value}' ${disabled}/>`;
        answers = answers.replace('[]', input);
      });

      return answers;
    }
    else {
      let input = `<input type='text' value='' ${disabled}/>`;
      let regex = /\[]/g;
      return answers.replace(regex, input);
    }
  }),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Notify input answers
   * @param {boolean} onLoad if this was called when loading the component
   */
  notifyInputAnswers: function(onLoad) {
    const component = this,
      inputs = component.$('.fib-answers input[type=text]'),
      answers = inputs.map(function (index, input) {
        let answer = Ember.$(input).val();
        return { value: Ember.$.trim(answer) };
      }).toArray();

    const answerCompleted = answers.join('').length > 0; //to check that at least 1 answer has text
    component.notifyAnswerChanged(answers);
    if (answerCompleted) {
      if(onLoad) {
        component.notifyAnswerLoaded(answers);
      } else {
        component.notifyAnswerCompleted(answers);
      }
    } else {
      component.notifyAnswerCleared(answers);
    }

  },

  /**
   * Set answers
   */
  setAnswersEvents:function() {
    const component = this;
    const inputs = component.$('.fib-answers');
    if(component.get('hasUserAnswer')) {
      component.notifyInputAnswers(true);
    }
    inputs.on('keyup', 'input[type=text]', function () {
      component.notifyInputAnswers(false);
    });
  }

});
