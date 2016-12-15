import Ember from 'ember';
import QuestionMixin from 'quizzes/mixins/reports/assessment/questions/question';

/**
 * Single choice
 *
 * Component responsible for show the single choice answer, what option are selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'gru-single-choice'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  answers: Ember.computed('question', function () {
    let component = this;
    let question = component.get('question');
    let userAnswer = component.get('userAnswer') ? component.get('userAnswer')[0] : null;
    let userAnswerCorrect = question.get('correct');
    if (component.get('showCorrect')) {
      userAnswer = question.get('question.correctAnswer')[0];
      userAnswerCorrect = true;
    }
    let answerValue = userAnswer ? userAnswer.value : null;
    let answers = question.get('question.answers');
    return answers.map(function(answer){
      return {
        text: answer.get('text'),
        selected: answer.get('value') === answerValue,
        correct: userAnswerCorrect
      };
    });
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

});
