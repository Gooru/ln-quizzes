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

  answers: Ember.computed("question", function () {
    let component = this;
    let question = component.get("question");
    let questionUtil = component.getQuestionUtil(question);
    let userAnswer = component.get("userAnswer");
    if (component.get("showCorrect")){
      userAnswer = questionUtil.getCorrectAnswer();
    }

    let userAnswerCorrect = questionUtil.isAnswerChoiceCorrect(userAnswer);
    let answers = question.get("answers");
    return answers.map(function(answer){
      return {
        text: answer.get("text"),
        selected: answer.get("id") === userAnswer,
        correct: userAnswerCorrect
      };
    });
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

});
