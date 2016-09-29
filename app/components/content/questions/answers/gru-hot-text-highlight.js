import Ember from 'ember';
import Answer from 'quizzes/models/content/answer';
import {QUESTION_CONFIG, QUESTION_TYPES} from 'quizzes/config/question';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['content', 'questions','answers', 'gru-hot-text-highlight'],

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    this.setupAnswer();
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Hot Spot Text Answers
   */
  answers: null,

  /**
   * Is in edit mode
   */
  editMode: false,

  /**
   * Indicates if the answer is for word selections
   */
  isHotTextHighlightWord: Ember.computed('answers.firstObject.highlightType', function() {
    return this.get('answers.firstObject.highlightType') === 'word';
  }),

  /**
   * Indicates if the answer is for sentence selections
   */
  isHotTextHighlightSentence: Ember.computed('answers.firstObject.highlightType', function() {
    return this.get('answers.firstObject.highlightType') === 'sentence';
  }),

  // -------------------------------------------------------------------------
  // Methods
  setupAnswer() {
    var component = this;
    if (component.get('editMode')) {
      let answers = component.get('answers');
      if (answers.length === 0) {
        answers.pushObject(Answer.create(Ember.getOwner(component).ownerInjection(), {
          isCorrect: true,
          type: 'text',
          text: '',
          highlightType: QUESTION_CONFIG[QUESTION_TYPES.hotTextHighlight].defaultType
        }));
      }
    }
  },

  // -------------------------------------------------------------------------
  // Observers
  /**
   * Observes for changes in the highlight type to force the validation of the answer in that type of questions
   */
  highlightTypeChange: Ember.observer('answers.firstObject.highlightType', function() {
    const component = this;
    Ember.run(function() {
      var $textarea = component.$('.gru-textarea textarea');
      $textarea.focus().val($textarea.val() + " ").trigger('blur'); // Forces the validation of the textarea
    });
  })
});
