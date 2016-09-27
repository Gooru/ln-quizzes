import Ember from 'ember';
import ContentEditMixin from 'gooru-web/mixins/content/edit';
import {QUESTION_CONFIG} from 'gooru-web/config/question';
import {CONTENT_TYPES, K12_CATEGORY} from 'gooru-web/config/config';
import ModalMixin from 'gooru-web/mixins/modal';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';
import FillInTheBlank from 'gooru-web/utils/question/fill-in-the-blank';
import { replaceMathExpression, removeHtmlTags } from 'gooru-web/utils/utils';


export default Ember.Component.extend(ContentEditMixin,ModalMixin,{

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:api-sdk/question
   */
  questionService: Ember.inject.service("api-sdk/question"),

  /**
   * @requires service:api-sdk/profile
   */
  profileService: Ember.inject.service("api-sdk/profile"),

  /**
   * @requires service:api-sdk/media
   */
  mediaService: Ember.inject.service("api-sdk/media"),
  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service("session"),

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'questions', 'gru-questions-edit'],

  tagName: 'article',

  // -------------------------------------------------------------------------
  // Actions
  actions:{
    /**
     * Edit Content
     */
    editContent: function () {
      var questionForEditing = this.get('question').copy();
      this.set('tempQuestion', questionForEditing);
      this.set('isEditing', true);
    },
    /**
     * Send request to publish a question
     */
    sendRequest: function () {
      this.set('wasRequestSent', true);
    },
    /**
     * Select question type
     */
    selectType:function(){
      //TO DO
      //this.set('tempQuestion.type', type); //Not supported yet
    },
    /**
     * Save Content
     */
    updateContent: function () {
      this.saveNewContent();
    },
    /**
     * Enable edit content builder
     */
    editBuilderContent: function(){
      var questionForEditing = this.get('question').copy();
      this.set('tempQuestion', questionForEditing);
      this.set('isBuilderEditing', true);
      this.set('editImagePicker', false);
      this.set('showAdvancedEditor', false);
    },
    /**
     * Disable edit content builder
     */
    cancelBuilderEdit: function(){
      this.set('isBuilderEditing', false);
      this.set('tempQuestion', null);
      this.set('editImagePicker', false);
    },
    /**
     * Save Content
     */
    publishToProfile: function(){
      var questionForEditing = this.get('question').copy();
      this.set('tempQuestion', questionForEditing);
      this.saveNewContent();
    },
    /**
    * Delete Question
    */
    deleteQuestion:function(){
      const myId = this.get("session.userId");
      var model = {
        content: this.get('question'),
        deleteMethod: function () {
          return this.get('questionService').deleteQuestion(this.get('question.id'));
        }.bind(this),
        type: CONTENT_TYPES.QUESTION,
        redirect: {
          route: 'profile.content.courses',
          params: {
            id: myId
          }
        }
      };

      this.actions.showModal.call(this,
        'content.modals.gru-delete-question',
        model, null, null, null, false);
    },

    addToCollection: function() {
      const component = this;
      if (component.get('session.isAnonymous')) {
        component.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        component.get('profileService').readAssessments(
          component.get('session.userId')
        ).then(function(assessments) {
          return component.get('profileService').readCollections(component.get('session.userId'))
            .then(function(collections) {
              return { content: component.get('question'), collections, assessments };
            });
        }).then(
          model => this.send('showModal', 'content.modals.gru-add-to-collection', model, null, "add-to")
        );
      }
    },

    selectSubject: function(subject){
      this.set("selectedSubject", subject);
    },

    /**
     * Remove tag data from the taxonomy list in tempUnit
     */
    removeTag: function (taxonomyTag) {
      var tagData = taxonomyTag.get('data');
      this.get('tempQuestion.standards').removeObject(tagData);
    },

    openTaxonomyModal: function(){
      this.openTaxonomyModal();
    },

    toggleImagePicker: function() {
      this.set('editImagePicker', true);
    },

    onShowAdvancedEditor: function(isChecked) {
      if(isChecked){
        this.set('showAdvancedEditor', true);
      }
    },

    focusQuestionTextEditor: function(){
      this.scrollToFirstEditor();
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Question model as instantiated by the route. This is the model used when not editing
   * or after any question changes have been saved.
   * @property {Question}
   */
  question: null,
  /**
   * Copy of the question model used for editing.
   * @property {Question}
   */
  tempQuestion: null,
  /**
   * Request pending approval
   * // TODO: Change this to a computed property of a question property
   * @property {Boolean}
   */
  isRequestApproved: false,

  /**
   * Request to make the question searchable been sent?
   * // TODO: Change this to a computed property of a question property
   * @property {Boolean}
   */
  wasRequestSent: false,

  /**
   * Toggle Options for the Advanced Edit button
   * @property {Ember.Array}
   */
  switchOptions: Ember.A([Ember.Object.create({
    'label': "On",
    'value': true
  }),Ember.Object.create({
    'label': "Off",
    'value': false
  })]),

  /**
   * @property{Array{}} questionTypes
   */
  questionTypes: Ember.computed(function(){
    let array = Ember.A(Object.keys(QUESTION_CONFIG));
    return array;
  }),
  /**
   * @property {Boolean} isBuilderEditing
   */
  isBuilderEditing :false,

  /**
   * @property {Boolean} Indicates if a correct answer is required
   */
  correctAnswerNotSelected: false,

  /**
   * @property {String} Error message to display below the description
   */
  descriptionError: null,

  /**
   * @property {Boolean} Indicates if a Hot spot answer has images
   */
  hasNoImages: false,

  /**
   *
   * @property {TaxonomyRoot}
   */
  selectedSubject: null,

  /**
   * @property {string}
   */
  k12Category: K12_CATEGORY.value,

  /**
   * @property {boolean}
   */
  standardDisabled: Ember.computed.not("selectedSubject"),

  /**
   * If the user wants to edit the image
   * @property {Boolean}
   */
  editImagePicker: false,

  /**
   * If the image picker should be shown
   * @property {Boolean}
   */
  showImagePicker: Ember.computed.or('editImagePicker', 'question.thumbnail'),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('question.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("question.standards"), false);
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  editableTags: Ember.computed('tempQuestion.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("tempQuestion.standards"), false, true);
  }),

  /**
   * If the advanced editor should be shown
   * @property {Boolean}
   */
  showAdvancedEditor: false,

  /**
   * If the advanced edit button should be shown
   @property {Boolean}
   */
  showAdvancedEditButton: Ember.computed('question', 'isBuilderEditing', function() {
    return this.get('question.supportAnswerChoices') && this.get('isBuilderEditing');
  }),

  // ----------------------------
  // Methods
  openTaxonomyModal: function(){
    var component = this;
    var standards = component.get('tempQuestion.standards') || [];
    var subject = component.get('selectedSubject');
    var subjectStandards = TaxonomyTagData.filterBySubject(subject, standards);
    var notInSubjectStandards = TaxonomyTagData.filterByNotInSubject(subject, standards);
    var model = {
      selected: subjectStandards,
      shortcuts: null,  // TODO: TBD
      subject: subject,
      callback: {
        success: function(selectedTags) {
          var dataTags = selectedTags.map(function(taxonomyTag) {
            return taxonomyTag.get('data');
          });
          const standards = Ember.A(dataTags);
          standards.pushObjects(notInSubjectStandards.toArray());
          component.set('tempQuestion.standards', standards);
        }
      }
    };

    this.actions.showModal.call(this, 'taxonomy.modals.gru-standard-picker', model, null, 'gru-standard-picker');
  },

  /**
   * Save new question content
   */
  saveNewContent: function() {
    const component = this;
    var editedQuestion = this.get('tempQuestion');
    var questionForValidate = editedQuestion.copy();
    var answersForValidate = questionForValidate.get('answers');
    editedQuestion.set('text',replaceMathExpression(editedQuestion.text));
    var promiseArray = [];
    var answersPromise = null;
    if (editedQuestion.get('isFIB')) {
      editedQuestion.set('answers', FillInTheBlank.getQuestionAnswers(editedQuestion.get("text")));
      component.updateQuestion(editedQuestion, component);
    } else if (editedQuestion.get('isOpenEnded')) {
      component.updateQuestion(editedQuestion, component);
    } else {
      if (editedQuestion.get('answers')) {
        if (this.get('showAdvancedEditButton')) {
          for (var i = 0; i < editedQuestion.get('answers').length; i++) {
            var answer = editedQuestion.get('answers')[i];
            answer.set('text', replaceMathExpression (answer.get('text')));
          }
        }
        if (editedQuestion.get('isHotSpotImage')) {
          this.hasImages(editedQuestion.get('answers'));
          promiseArray = editedQuestion.get('answers').map(
            component.getAnswerSaveImagePromise.bind(component)
          );
          answersPromise = Ember.RSVP.Promise.all(promiseArray).then(function (values) {
            for (var i = 0; i < editedQuestion.get('answers').length; i++) {
              editedQuestion.get('answers')[i].set('text', values[i]);
            }
            return Ember.RSVP.Promise.all(
              answersForValidate.map(component.getAnswerValidatePromise)
            );
          });
        } else {
          promiseArray = answersForValidate.map(component.getAnswerValidatePromise);
          answersPromise = Ember.RSVP.Promise.all(promiseArray);
        }
        answersPromise.then(function(values) {
          if (component.validateAnswers(values, editedQuestion)) {
            component.updateQuestion(editedQuestion,component);
          }
        });
      } else {
        component.updateQuestion(editedQuestion,component);
      }
    }
  },

  updateQuestion:function(editedQuestion, component){
    let question = component.get('question');

    editedQuestion.validate().then(function ({ validations }) {
      if (validations.get('isValid')) {
        let imageIdPromise = new Ember.RSVP.resolve(editedQuestion.get('thumbnail'));
        if(editedQuestion.get('thumbnail') && editedQuestion.get('thumbnail') !== question.get('thumbnail')) {
          imageIdPromise = component.get('mediaService').uploadContentFile(editedQuestion.get('thumbnail'));
        }
        var defaultTitle= component.get('i18n').t('common.new-question').string;
        var defaultText= component.get('i18n').t('common.new-question-text').string;
        var editedQuestionTitle = editedQuestion.title;
        var editedQuestionText = editedQuestion.text;

        if (editedQuestionTitle === defaultTitle && editedQuestionText !== defaultText && editedQuestionText !== '') {
          editedQuestionText = $.trim(editedQuestionText);
          var newTitle = editedQuestionText.substr(0, 50);

          editedQuestion.set('title', newTitle);
        }
        imageIdPromise.then(function(imageId) {
          editedQuestion.set('thumbnail', imageId);
          component.get('questionService').updateQuestion(editedQuestion.id, editedQuestion)
            .then(function () {
              component.set('question', editedQuestion);
              component.set('isEditing', false);
              component.set('isBuilderEditing', false);
              component.set('editImagePicker', false);
              question.merge(editedQuestion, ['title', 'standards', 'audience', 'depthOfknowledge', 'thumbnail']);
            })
            .catch(function (error) {
              var message = component.get('i18n').t('common.errors.question-not-updated').string;
              component.get('notifications').error(message);
              Ember.Logger.error(error);
            });
        });
      }
      component.set('didValidate', true);
    });
  },

  /**
   * Check that validate promises are not returning false
   */
  validateAnswers: function(promiseValues, question) {
    var valid = true;
    promiseValues.find(function (promise) {
      if (promise === false) {
        valid = false;
      }
    });
    return valid && this.isCorrectAnswerSelected(question);
  },

  /**
   * Check if an answer is selected as correct
   */
  isCorrectAnswerSelected: function(question) {
    if(question.get('answers').length > 0){
      let correctAnswers = question.get('answers').filter(function(answer) {
        return answer.get('isCorrect');
      });
      if (correctAnswers.length > 0) {
        this.set('correctAnswerNotSelected', false);
      } else {
        this.set('correctAnswerNotSelected', true);
        return false;
      }
    }
    return true;
  },

  /**
   * Returns upload image promises
   */
  getAnswerSaveImagePromise: function(answer) {
    if (answer.get('text') && typeof (answer.get('text').name) === 'string') {
      return this.get('mediaService').uploadContentFile(answer.get('text'));
    } else {
      return answer.get('text');
    }
  },

  /**
   * Returns validate answer promises
   */
  getAnswerValidatePromise: function(answer) {
    answer.set('text',removeHtmlTags (answer.text));
    return answer.validate().then(function ({ validations }) {
      return validations.get('isValid');
    });
  },

  /**
   * Check if an hs-answer has image
   */
  hasImages: function(answers) {
    if(answers.length > 0){
      let answerImages = answers.filter(function(answer) {
        return answer.get('text')===null;
      });
      if (answerImages.length > 0) {
        this.set('hasNoImages', true);
      } else {
        this.set('hasNoImages', false);
        return false;
      }
    }
    return true;
  },

  /**
   * scroll to first editor of the page, when it has several editor answers
   */
  scrollToFirstEditor: function () {
    var component= this;
    Ember.run.later(function() {
      var editorID = '#builder .gru-rich-text-editor:eq(0) .rich-editor';
      var editor = component.$(editorID);
      if(editor && editor.length>0) {
        editor[0].focus();
      }
    }, 100);
  }
});
