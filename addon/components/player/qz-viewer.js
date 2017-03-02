import Ember from 'ember';
import { ASSESSMENT_SHOW_VALUES, RESOURCE_COMPONENT_MAP } from 'quizzes-addon/config/quizzes-config';
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
  // Events
  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    this.calculateResourceContentHeight();
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
   * The resource component selected
   * @property {string}
   */
  resourceComponentSelected: Ember.computed('resource.id', function () {
    const resourceType = (this.get('resource.isImageResource') ? 'image' : this.get('resource.resourceType'));
    var component = RESOURCE_COMPONENT_MAP[resourceType];

    if (!component) {
      Ember.Logger.error(`Resources of type ${resourceType} are currently not supported`);
    } else {
      Ember.Logger.debug('Resources component selected: ', component);
      return component;
    }
  }),

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
  submitted: false,

  // -------------------------------------------------------------------------
  // Observers
  /**
   * Observes for the resource change
   */
  resourceObserver: function() {
    this.calculateResourceContentHeight();
  }.observes('resource.id'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Calculates the height of the content area (it will change depending on height
   * of the narration -if there is one)
   */
  calculateResourceContentHeight: function() {
    if (this.get('resource.isUrlResource') ||
        this.get('resource.isPDFResource') ||
        this.get('resource.isImageResource') &&
        this.get('isNotIframeUrl')===false) {
      var narrationHeight = this.$('.narration').innerHeight();
      var contentHeight = this.$('.content').height();

      // The 4 pixels subtracted are to make sure no scroll bar will appear for the content
      // (Users should rely on the iframe scroll bar instead)
      this.set('calculatedResourceContentHeight', contentHeight - narrationHeight - 4);
    }
  }
});
