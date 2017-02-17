import Ember from 'ember';
import {QUESTION_TYPES} from 'quizzes/config/question';

/**
 * Resource Model
 *
 * @typedef {Object} Resource
 */
export default Ember.Object.extend({

  /**
   * List of possible answers/choices
   * @property {Answer[]} answers
   */
  answers: Ember.A(),

  /**
   * @property {string} body
   */
  body: null,

  /**
   * list of correct answers
   * @property {Answer[]}
   */
  correctAnswer: Ember.A(),

  /**
   * resource id
   * @property {string} id
   */
  id: null,

  /**
   * indicates if the object is a question
   * @property {boolean} isQuestion
   */
  isQuestion: Ember.computed.not('isResource'),

  /**
   * indicates if the object is a resource
   * @property {boolean} isResource
   */
  isResource: null,

  /**
   * Number of choices that can be selected
   * @property {boolean} shuffle
   */
  maxChoices: 0,

  /**
   * @property {string} owner
   */
  owner: null,

  /**
   * Text to show just before the answers
   * @property {boolean} shuffle
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
   * Indicates the resource format. i.e image, text, video, interaction, webpage, question
   * @property {string} format
   */
  format: Ember.computed('isResource', function() {
    return this.get('isResource') ? 'resource' : 'question';
  }),

  /**
   * Indicates if the question has answers
   * @property {boolean}
   */
  hasAnswers: Ember.computed.bool('answers.length'),

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
   * @see components/player/qz-fib.js
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
   * @see components/player/qz-hot-text-highlight.js
   */
  isHotTextHighlight: Ember.computed.or('isHotTextHighlightWord', 'isHotTextHighlightSentence'),

  /**
   * @property {boolean} indicates if the question is hot text word type
   */
  isHotTextHighlightWord: Ember.computed.equal('type', QUESTION_TYPES.hotTextHighlightWord),

  /**
   * @property {boolean} indicates if the question is hot text sentence type
   */
  isHotTextHighlightSentence: Ember.computed.equal('type', QUESTION_TYPES.hotTextHighlightSentence),

  /**
   * @property {boolean} indicates if the question is reorder
   * @see components/player/qz-reorder.js
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
   * @property {boolean} indicates if the question is single choice type
   * @see components/player/qz-single-choice.js
   */
  isSingleChoice: Ember.computed.equal('type', QUESTION_TYPES.singleChoice),

  /**
   * @property {boolean} indicates if the question is multiple answer type
   * @see components/player/qz-multiple-answer.js
   */
  isMultipleAnswer: Ember.computed.equal('type', QUESTION_TYPES.multipleAnswer),

  /**
   * @property {boolean} indicates if the question is open ended type
   * @see components/player/qz-open-ended.js
   */
  isOpenEnded: Ember.computed.equal('type', QUESTION_TYPES.openEnded),

  /**
   * Indicates if it is an pdf resource
   * @property {boolean}
   */
  isPDFResource: Ember.computed.equal('type', 'handouts'),

  /**
   * @property {boolean} indicates if the question is true false type
   * @see components/player/qz-true-false.js
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
