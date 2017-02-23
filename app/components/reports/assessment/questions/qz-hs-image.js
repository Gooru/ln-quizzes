import Ember from 'ember';
import QuestionMixin from 'quizzes/mixins/reports/assessment/questions/question';
import {DEFAULT_IMAGES} from 'quizzes/config/config';

/**
 * Hot spot image
 *
 * Component responsible for show the hot spot image, which option is selected
 * and the correct option.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(QuestionMixin, {

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'questions', 'qz-hs-image'],


  // -------------------------------------------------------------------------
  // Properties
  /**
   * Return the hot spot image answers array to show on the component, indicating if the user select the answer and
   * if is correct or not.
   */
  answers: Ember.computed('question', 'anonymous', function () {
    let component = this;
    let question = component.get('question');
    let userAnswers = component.get('userAnswer');
    let correctAnswers = question.get('question.correctAnswer');
    let anonymous = component.get('anonymous');
    if (component.get('showCorrect')){
      userAnswers = correctAnswers;
    }
    let answers = question.get('question.answers');

    return answers.map(function(answer){
      let userAnswerCorrect = false;
      let selected = false;
      if (userAnswers.findBy('value', answer.value)){
        userAnswerCorrect =  correctAnswers.findBy('value', answer.value);
        selected = true;
      }

      let elementClass = (anonymous) ? 'anonymous' :
        ((userAnswerCorrect) ? 'correct' : 'incorrect');

      let cdnURL = component.get('configurationService.configuration.properties.cdnURL');
      return {
        image: answer.get('text') ? cdnURL + answer.get('text') : DEFAULT_IMAGES.QUESTION_PLACEHOLDER_IMAGE,
        selected: selected,
        'class': elementClass
      };
    });
  })
});
