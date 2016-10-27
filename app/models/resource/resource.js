import Ember from 'ember';
import {QUESTION_TYPES} from 'quizzes/config/question';
import FillInTheBlank from 'quizzes/utils/question/fill-in-the-blank';

/**
 * Resource Model
 *
 * @typedef {Object} Resource
 */
export default Ember.Object.extend({

  /**
   * List of possible answers/choices
   * @property {Answer[]} choices
   */
  choices: Ember.A(),

  /**
   * list of correct answers
   * @property {Answer[]} correctResponse
   */
  correctResponse: Ember.A(),

  /**
   * resource id
   * @property {string} id
   */
  id: null,

  /**
   * @property {string} text
   */
  body: null,

  /**
   * Number of choices that can be selected
   * @property {number} maxChoices
   */
  maxChoices: 1,

  /**
   * @property {string} owner
   */
  owner: null,

  /**
   * Text to show just before the answers
   * @property {string} prompt
   */
  prompt: null,

  /**
   * @property {number} sequence
   */
  sequence: null,

  /**
   * If the answers should be shuffled
   * @property {boolean} shuffle
   */
  shuffle: false,

  /**
   * @property {string} title
   */
  title: null,

  /**
   * Indicates the resource or question type.
   * @property {string} type
   */
  type: null,

  // -------------------------------------------------------------------------
  // Computed

  /**
   * Returns the FIB text
   * @property {string}
   */
  fibText: Ember.computed('body', function() {
    return FillInTheBlank.toFibText(this.get('body'));
  }),

  /**
   * Returns 'question' or 'resource' depending on the resource type
   * @property {string} format
   */
  format: Ember.computed('isQuestion', function() {
    return this.get('isQuestion') ? 'question' : 'resource';
  }),

  /**
   * Indicates if the question has answers
   * @property {boolean}
   */
  hasAnswers: Ember.computed.bool('choices.length'),

  /**
   * Indicates if the question has answers
   * @property {boolean}
   */
  hasCorrectResponse: Ember.computed.bool('correctResponse.length'),

  /**
   * Indicates if the question has owner
   * @property {boolean}
   */
  hasOwner: Ember.computed.bool('owner'),

  /**
   * @property {boolean} indicates if the question is fill in the blank type
   * @see components/player/gru-fib.js
   */
  isFIB: Ember.computed.equal('type', QUESTION_TYPES.fib),

  /**
   * @property {boolean} indicates if the question is hot spot image type
   * @see components/player/gru-hot-spot-image.js
   */
  isHotSpotImage: Ember.computed.equal('type', QUESTION_TYPES.hotSpotImage),

  /**
   * @property {boolean} indicates if the question is hot spot text type
   * @see components/player/gru-hot-spot-text.js
   */
  isHotSpotText: Ember.computed.equal('type', QUESTION_TYPES.hotSpotText),

  /**
   * @property {boolean} indicates if the question is hot spot text
   * @see components/player/gru-hot-text-highlight.js
   */
  isHotTextHighlight: Ember.computed.equal('type', QUESTION_TYPES.hotTextHighlight),

  /**
   * @property {boolean} indicates if the question is hot text word type
   */
  isHotTextHighlightWord: Ember.computed.equal('choices.firstObject.highlightType', 'word'),

  /**
   * @property {boolean} indicates if the question is hot text sentence type
   */
  isHotTextHighlightSentence: Ember.computed.equal('choices.firstObject.highlightType', 'sentence'),


  /**
   * @property {boolean} indicates if the question is reorder
   * @see components/player/gru-reorder.js
   */
  isHotTextReorder: Ember.computed.equal('type', QUESTION_TYPES.hotTextReorder),

  /**
   * Indicates if it is an image resource
   * @property {boolean}
   */
  isImageResource: Ember.computed('type', function(){
    var type = this.get('type');
    return type && type.indexOf('image') >= 0;
  }),

  /**
   * @property {boolean} indicates if the question is multiple choice type
   * @see components/player/gru-multiple-choice.js
   */
  isMultipleChoice: Ember.computed.equal('type', QUESTION_TYPES.multipleChoice),

  /**
   * @property {boolean} indicates if the question is multiple answer type
   * @see components/player/gru-multiple-answer.js
   */
  isMultipleAnswer: Ember.computed.equal('type', QUESTION_TYPES.multipleAnswer),

  /**
   * @property {boolean} indicates if the question is open ended type
   * @see components/player/gru-open-ended.js
   */
  isOpenEnded: Ember.computed.equal('type', QUESTION_TYPES.openEnded),

  /**
   * Indicates if it is an pdf resource
   * @property {boolean}
   */
  isPDFResource: Ember.computed.equal('type', 'handouts'),

  /**
   * @property {boolean} indicates if the resource is a question
   */
  isQuestion: null,

  /**
   * @property {boolean} indicates if the question is true false type
   * @see components/player/gru-true-false.js
   */
  isTrueFalse: Ember.computed.equal('type', QUESTION_TYPES.trueFalse),

  /**
   * Indicates if it is an url resource
   * @property {boolean}
   */
  isUrlResource: Ember.computed.equal('type', 'resource/url'),

  /**
   * Indicates if it is an vimeo resource
   * @property {boolean}
   */
  isVimeoResource: Ember.computed.equal('type', 'vimeo/video'),

  /**
   * Indicates if it is an youtube resource
   * @property {boolean}
   */
  isYoutubeResource: Ember.computed.equal('type', 'video/youtube')

});
