import Ember from 'ember';
import QuestionMixin from 'quizzes-addon/mixins/reports/assessment/questions/question';
import { FIB_REGEX } from 'quizzes-addon/config/quizzes-config';

/**
 * Fill in the blank
 *
 * Component responsible for controlling the logic and appearance of a fill in the blank
 * question inside of the assessment report.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-fib'],

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Return an array with every sentence and user answer, and indicate if is correct or incorrect
   * @return {Array}
   */
  answer: Ember.computed('question', 'anonymous','userAnswer','question.answers.@each.value', function () {
    let component = this;
    let question = component.get('question');
    let questionText = question.get('question.body');
    let questionTextParts = questionText.split(FIB_REGEX);
    let userAnswers = component.get('userAnswer');
    let anonymous = component.get('anonymous');
    let correctAnswers = question.get('question.correctAnswer');

    if (component.get('showCorrect')){
      userAnswers = question.get('question.correctAnswer');
    }

    let answers = userAnswers.map(function(answer){
      let userAnswer = userAnswers.findBy('value', answer.value);
      let correctAnswer = correctAnswers.findBy('value', userAnswer.value);
      let correct = correctAnswer && correctAnswers.indexOf(correctAnswer) === userAnswers.indexOf(userAnswer);
      let elementClass = (anonymous) ? 'anonymous' : ((correct) ?'correct':'incorrect');
      return {
        text: userAnswer.value,
        'class': `answer ${elementClass}`
      };
    });

    let sentences = questionTextParts.map(function(questionTextPart){
      return {
        text: questionTextPart,
        'class': 'sentence'
      };
    });

    sentences = (userAnswers && userAnswers.length) ? sentences : [];

    return this.mergeArrays (sentences, answers);
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Merge sentences and answers arrays
   * @return {Array}
   */
  mergeArrays: function(sentences, answers){
    answers.forEach(function(item, index){ sentences.insertAt((index*2)+1, item); });
    return sentences;
  }

});
