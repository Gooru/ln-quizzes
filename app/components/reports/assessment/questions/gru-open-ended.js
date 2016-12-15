import Ember from 'ember';
import QuestionMixin from 'quizzes/mixins/reports/assessment/questions/question';

/**
 * Open Ended Question
 *
 * Component responsible for controlling the logic and appearance of an open
 * ended question inside of the assessment report
 *
 */
export default Ember.Component.extend(QuestionMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions','gru-open-ended'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  answer: Ember.computed('question', 'showCorrect', function () {
    const correctAnswer = this.get('question.question.correctAnswer.text') || 'N/A';
    return (this.get('showCorrect')) ? correctAnswer : this.get('userAnswer');
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

});
