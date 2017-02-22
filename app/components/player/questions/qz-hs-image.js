import Ember from 'ember';
import HSTextComponent from './qz-hs-text';

/**
 * Hot Spot Image
 *
 * Component responsible for controlling the logic and appearance of a multiple choice
 * image question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments components/player/questions/qz-hs-text.js
 */
export default HSTextComponent.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes
  classNames:['qz-hs-image'],


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @typedef answers
   * @prop {value} id - answer value
   * @prop {text} text - url string for an image
   */
  answers: Ember.computed.map('question.answers', function(answer) {
    return {
      value: answer.get('value'),
      text: answer.get('text')
    };
  }),

  /**
   * @prop {String} instructions - Question instructions
   */
  instructions: Ember.computed(function() {
    var action = this.get('i18n').t(this.get('instructionsActionTextKey')).string;
    return this.get('i18n').t('qz-hs-image.instructions', {action});
  })

});
