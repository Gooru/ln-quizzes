import Ember from 'ember';
import { ASSESSMENT_SHOW_VALUES } from 'quizzes-addon/config/quizzes-config';
/**
 * Player viewer
 *
 * Component responsible for showing the appropriate content viewer per content type
 * (i.e. question, pdf file, video, etc.).
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-viewer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /***
     * When the user submits the question
     * @param {Resource} question
     * @param {QuestionResult} questionResult
     * @returns {boolean}
     */
    submitQuestion: function (question, questionResult) {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onSubmitQuestion', question, questionResult);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * The text for the submit button
   * @property {string}
   */
  buttonTextKey: Ember.computed('collection', 'resource.id', 'resourceResult.submitted', function() {
    let i18nKey = 'common.save-next';
    let showFeedback = this.get('collection.showFeedback') === ASSESSMENT_SHOW_VALUES.IMMEDIATE;
    if(!showFeedback || this.get('isTeacher')) {
      if (this.get('collection').isLastResource(this.get('resource'))) {
        i18nKey = (this.get('collection').get('isAssessment')) ? 'common.save-submit' : 'common.save-finish';
      }
    } else {
      if(this.get('resourceResult.submitted')) {
        i18nKey = this.get('collection').isLastResource(this.get('resource')) ?
          'common.finish' : 'common.next';
      } else {
        i18nKey = 'common.submit';
      }
    }
    return i18nKey;
  }),

  /** Calculated height designated for the content area of a resource
   * @see components/player/resources/qz-url-resource.js
   * The height of the content area needs to be calculated because the height of the narration varies and may cause a scroll bar to appear
   * @property {Number}
   */
  calculatedResourceContentHeight: 0,

  /**
   * The collection playing
   * @property {Collection} collection
   */
  collection: null,

  /**
   * The text for the action in the instructions
   * @property {string}
   */
  instructionsActionTextKey: Ember.computed('collection', 'resource.id', 'resourceResult.submitted', function() {
    let i18nKey = 'common.save-next';
    let showFeedback = this.get('collection.showFeedback') === ASSESSMENT_SHOW_VALUES.IMMEDIATE;
    if(!showFeedback) {
      if (this.get('collection').isLastResource(this.get('resource'))) {
        return (this.get('collection').get('isAssessment')) ? 'common.save-submit' : 'common.save-finish';
      }
    } else {
      i18nKey = 'common.submit';
    }
    return i18nKey;
  }),

  /**
   * @property {boolean}
   */
  isNotIframeUrl: null,

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not('isStudent'),

  /**
   * @property {string} on submit question action
   */
  onSubmitQuestion: 'submitQuestion',

  /**
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * The resource or question result playing
   * @property {ResourceResult}
   */
  resourceResult: null,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * @property {string}
   */
  role: null,

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false
});
