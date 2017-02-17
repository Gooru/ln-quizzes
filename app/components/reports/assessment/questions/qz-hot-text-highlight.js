import Ember from 'ember';
import QuestionMixin from 'quizzes/mixins/reports/assessment/questions/question';
import QuestionUtil from 'quizzes/utils/question/hot-text-highlight';

/**
 * Hot Text Highlight
 *
 * Component responsible for controlling the logic and appearance of an Hot Text Highlight
 * question inside of the assessment report.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-hot-text-highlight'],

  // -------------------------------------------------------------------------
  // Properties
  items: Ember.computed('question', function () {
    let component = this;
    let question = component.get('question');
    let showCorrect = component.get('showCorrect');
    let correctAnswers = question.get('question.correctAnswer');
    let userAnswers = showCorrect ? correctAnswers : component.get('userAnswer');
    let items = QuestionUtil.getItems(question.get('question'));
    items.forEach(item => {
      let value = `${item.get('text')},${item.get('index')}`;
      let selected = !!userAnswers.findBy('value', value);
      item.set('selected', selected);
      item.set('correct', !selected || !!correctAnswers.findBy('value', value));
    });
    return items;
  })

  // -------------------------------------------------------------------------
  // Methods
});
