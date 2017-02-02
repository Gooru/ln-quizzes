import Ember from 'ember';
import QuestionMixin from 'quizzes/mixins/reports/assessment/questions/question';

/**
 * Single choice
 *
 * Component responsible for show the reorder, what option are selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-reorder'],

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Return the drag and drop answers to show on the component, if is show correct: return the list
   * whit the correct answers, if not return the answers with the order as the user answered and if is correct or not.
   */
  answers:Ember.computed('question', 'userAnswer',
    'question.answers.@each.text', 'question.answers.@each.value', function () {
    let component = this;
    let question = component.get('question');
    let userAnswers = component.get('userAnswer');
    let correctAnswers = question.get('question.correctAnswer');
    if (component.get('showCorrect')){
      userAnswers = correctAnswers;
    }
    let answers = question.get('question.answers');
    return answers.map(function(answer){
      let userAnswer = userAnswers.findBy('value', answer.value);
      let correctAnswer = correctAnswers.findBy('value', userAnswer.value);
      let correct = correctAnswer && correctAnswers.indexOf(correctAnswer) === userAnswers.indexOf(userAnswer);
      return {
        selectedOrder: userAnswers.indexOf(userAnswer)+1,
        text: answer.get('text'),
        correct
      };
    });
  })
});
