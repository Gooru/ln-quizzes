import Ember from 'ember';
import QuestionComponent from './qz-question';
/**
 * Hot Spot Text
 *
 * Component responsible for controlling the logic and appearance of a hot spot
 * text question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-hs-text'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  removeSubscriptions: Ember.on('willDestroyElement', function() {
    this.$('li.answer').off('click');
  }),

  setupInstanceProperties: Ember.on('init', function() {
    const component = this;
    component.setAnswers();
  }),

  setupSubscriptions: Ember.on('didInsertElement', function() {
    const component = this;
    const readOnly = component.get('readOnly');

    component.setUserAnswer();

    if (!readOnly){
      if(component.get('userAnswer')) {
        component.notify(true);
      }
      this.$('li.answer').on('click', function() {
        const $this = $(this);
        const answerId = $this.data('id');

        var selected = component.get('selectedAnswers');
        var idx = selected.indexOf(answerId);

        $this.toggleClass('selected');

        if (idx === -1) {
          selected.push(answerId);
        } else {
          selected.splice(idx, 1);
        }

        component.notify(false);
      });
    }

  }),

  // -------------------------------------------------------------------------
  // Properties

  /*
   * @typedef answers
   * @prop {String} id - answer id
   * @prop {String} content - markup string containing the answer text
   */
  answers: Ember.computed.map('question.answers', function(answer) {
    return {
      id: answer.get('id'),
      content: answer.get('text')
    };
  }),

  /*
   * @prop {String} instructions - Question instructions
   */
  instructions: Ember.computed(function() {
    return this.get('i18n').t('qz-hs-text.instructions');
  }),

  /*
   * @prop {Array} selectedAnswers - Array of ids for each one of the answers selected by the user
   */
  selectedAnswers: null,

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Notifies answer events
   * @param {boolean} onLoad if this was called when loading the component
   */
  notify: function(onLoad) {
    const component = this;
    let selected = component.get('selectedAnswers');
    let cleared = !selected.length;
    component.notifyAnswerChanged(selected);
    if (cleared) {
      component.notifyAnswerCleared(selected);
    } else {
      if(onLoad) {
        component.notifyAnswerLoaded(selected);
      } else {
        component.notifyAnswerCompleted(selected);
      }
    }
  },

  /**
   * Set answers
   */
  setAnswers: function() {
    let userAnswer = this.get('userAnswer');
    this.set('selectedAnswers', userAnswer || []);
  },

  /**
   * Set the user answer
   */
  setUserAnswer: function() {
    if (this.get('hasUserAnswer')) {
      const userAnswer = this.get('userAnswer');
      userAnswer.forEach(function(answerId){
        let selector = `li.answer[data-id='${answerId}']`;
        let $answer = Ember.$(selector);
        $answer.toggleClass('selected');
      });
    }
  }
});