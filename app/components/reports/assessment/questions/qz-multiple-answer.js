import Ember from 'ember';
import QuestionMixin from 'quizzes/mixins/reports/assessment/questions/question';

/**
 * Multiple answer
 *
 * Component responsible for show the multiple answer, which option is selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-multiple-answer'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  answers: Ember.computed('question', 'userAnswer',
    'question.answers.@each.text', 'question.answers.@each.value', function () {
    let component = this;
    let question = component.get('question');
    let userAnswers = component.get('userAnswer') || null;
    let correctAnswers = question.get('question.correctAnswer');
    if (component.get('showCorrect')){
      userAnswers = correctAnswers;
    }

    let answers = question.get('question.answers');
    return answers.map(answer => {
      let userAnswer = userAnswers.filterBy('value', answer.value);
      let correctAnswer = correctAnswers.filterBy('value', answer.value);
      let correct = userAnswer.length === correctAnswer.length;
      return {
        text: answer.text,
        selected: !!userAnswer.length,
        correct
      };
    });
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
