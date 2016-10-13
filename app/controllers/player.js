import Ember from 'ember';

/**
 * @module
 * @typedef {Object} PlayerController
 *
 * @augments Ember/Controller
 */
export default Ember.Controller.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  queryParams: ['resourceId', 'role', 'type'],

  session: Ember.inject.service('session'),

  /**
   * @dependency {Ember.Service} i18n service
   */
  i18n: Ember.inject.service(),

  /**
   * @dependency {Ember.Service} Service to rate a resource
   */
  eventsService: Ember.inject.service('api-sdk/events'),


  // -------------------------------------------------------------------------
  // Attributes


  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * Triggered when an resource emotion is selected
     * @param {string} emotionScore
     */
    changeEmotion: function(emotionScore) {
      let resourceResult = this.get('resourceResult');
      resourceResult.set('reaction', emotionScore);
    },

    /**
     * Action triggered when the user close de navigator panel
     */
    closeNavigator:function(){
      const $appContainer = Ember.$( '.app-container' );
      if ($appContainer.hasClass( 'navigator-on' )){
        $appContainer.removeClass( 'navigator-on' );
      }
    },

    /**
     * When clicking at submit all or end
     */
    finishCollection: function() {
      const controller = this;
      const collection = controller.get('collection');
      if (collection.get('isAssessment')) {
        //open confirmation modal
        controller.finishConfirm();
      } else {
        //finishes the last resource
        controller.finishCollection();
      }
    },

    /**
     * Action triggered when the user open de navigator panel
     */
    openNavigator: function(){
      Ember.$( '.app-container' ).addClass( 'navigator-on' );
    },

    /**
     * Triggered when a navigator resource is selected
     * @param {Resource} resource
     */
    selectNavigatorItem: function(resource){
      const controller = this;
      controller.moveToResource(resource);
    },

    /**
     * Handle onSubmitQuestion event from gru-question-viewer
     * @see components/player/gru-question-viewer.js
     * @param {Resource} question
     * @param {QuestionResult} questionResult
     */
    submitQuestion: function(question){
      const controller = this;
      controller.moveOrFinish(question);
    }
  },

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {AssessmentResult} assessmentResult
   */
  assessmentResult: null,

  /**
   * The collection presented in this player
   * @property {Collection} collection
   */
  collection: null,

  /**
   * Is Assessment
   * @property {boolean}
   */
  isAssessment: Ember.computed.alias('collection.isAssessment'),

  /**
   * Should resource navigation in the player be disabled?
   * @property {Lesson}
   */
  isNavigationDisabled: false,

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isNotIframeUrl: Ember.computed('resource', function(){
    const resource = this.get('resource');
    return (resource && resource.displayGuide);
  }),

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isResource: Ember.computed('resource', function(){
    const resource = this.get('resource');
    return (resource && !resource.get('isQuestion'));
  }),

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
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * Query param
   * @property {string} resourceId
   */
  resourceId: null,

  /**
   * Return the list of resources available to show on the player
   * @property {ResourceResult[]}
   */
  resourcesPlayer: Ember.computed('collection.resources','assessmentResult.sortedResourceResults', function(){
    var availableResources = this.get('collection.resources').mapBy('id');
    return this.get('assessmentResult.sortedResourceResults').filter(function(item){
       return availableResources.contains(item.resourceId);
    });
  }),

  /**
   * The resource result playing
   * @property {ResourceResult}
   */
  resourceResult: null,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * This property is not used for the context-player
   * @property {string}
   */
  role: null,

  /**
   * @property {boolean} indicates if the answer should be saved
   */
  saveEnabled: true, // save only when logged in

  /**
   * Indicates if content should be displayed
   * @property {boolean} showContent
   */
  showContent: false,

  /**
   * Indicates if the report should be displayed
   * @property {boolean} showReport
   */
  showReport: false,

  /**
   * Query param indicating if it is a collection or assessment
   * @property {string}
   */
  type: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Saves an assessment result
   * @param {AssessmentResult} assessmentResult
   */
  finishCollection: function() {
    const controller = this;
    let assessmentResult = controller.get('assessmentResult');
    return controller.get('saveEnabled') ?
      controller.get('eventsService').endContext(assessmentResult.get('contextId')) :
      Ember.RSVP.resolve();
  },

  /**
   * Opens the confirmation dialog to finish the assessment
   */
  finishConfirm: function() {
    const controller = this;
    controller.actions.showModal.call(this,
      'content.modals.gru-submit-confirmation',
      {
        onConfirm: controller.finishCollection.bind(controller)
      });
  },

  /**
   * Moves to the next resource or finishes the collection
   * @param {Resource} resource
   */
  moveOrFinish: function(resource) {
    const controller = this;
    const next = controller.get('collection').nextResource(resource);
    if (next){
      Ember.$(window).scrollTop(0);
      controller.moveToResource(next);
    } else {
      let assessmentResult = controller.get('assessmentResult');
      let resourceResult = controller.get('resourceResult');
      return controller.saveResourceResult(null, assessmentResult, resourceResult).then(function() {
        controller.finishConfirm();
      });
    }
  },

  /**
   * Moves to resource
   * @param {Resource} resource
   */
  moveToResource: function(resource) {
    const controller = this;
    let assessmentResult = controller.get('assessmentResult');
    let resourceResult = controller.get('resourceResult');
    let resourceId = resource.get('id');
    controller.saveResourceResult(resourceId, assessmentResult, resourceResult)
      .then(function() {
        Ember.run(() => controller.set('resource', null));
        controller.setProperties({
          showReport: false,
          resourceId,
          resource,
          resourceResult: assessmentResult.getResultByResourceId(resourceId)
        }); //saves the resource status
      });
  },

  /**
   * Reset all values to default
   */
  resetValues: function() {
    this.set('resourceId', null);
    this.set('resource', null);
    this.set('resourceResult', null);
    this.set('role', null);
    this.set('showContent', false);
  },

  /**
   * Saves the resource result and moves to the next
   * @param resourceId
   * @param assessmentResult
   * @param resourceResult
   * @returns {Promise.<boolean>}
   */
  saveResourceResult: function(resourceId, assessmentResult, resourceResult) {
    let controller = this;
    let promise = Ember.RSVP.resolve();
    let save = controller.get('saveEnabled');
    if (save) {
      let contextId = assessmentResult.get('contextId');
      promise = controller.get('eventsService')
        .moveToResource(resourceId, contextId, resourceResult);
    }
    return promise;
  },

  /**
   * Starts the assessment or collection
   */
  startAssessment: function() {
    const controller = this;
    const collection = controller.get('collection');
    const assessmentResult = controller.get('assessmentResult');
    const hasResources = collection.get('hasResources');
    let resource = null;

    controller.set('showContent',true);
    if(hasResources) {
      resource = assessmentResult.get('currentResource');
      if(controller.get('resourceId')) { //if has a resource id as query param
        resource = collection.getResourceById(controller.get('resourceId'));
      }
    }
    if(resource) {
      controller.moveToResource(resource);
    }
  }

});
