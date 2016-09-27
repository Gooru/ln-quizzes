import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';
import SessionMixin from '../mixins/session';
import {generateUUID} from 'gooru-web/utils/utils';
/**
 * @module
 * @typedef {Object} PlayerController
 *
 * @augments Ember/Controller
 */
export default Ember.Controller.extend(SessionMixin, ModalMixin, {

  // -------------------------------------------------------------------------
  // Dependencies
  queryParams: ['resourceId', 'role', 'type'],

  session: Ember.inject.service("session"),

  /**
   * @dependency {Ember.Service} i18n service
   */
  i18n: Ember.inject.service(),

  /**
   * @dependency {Ember.Service} Service to rate a resource
   */
  eventsService: Ember.inject.service("api-sdk/events"),


  // -------------------------------------------------------------------------
  // Attributes


  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * When clicking at submit all or end
     */
    finishCollection: function(){
      const controller = this;
      const collection = this.get('collection');

      if (collection.get('isAssessment')) {
        //open confirmation modal
        controller.finishConfirm();
      } else {
        //finishes the last resource
        controller.finishResourceResult(controller.get('resourceResult')).then(function() {
          controller.finishCollection();
        });
      }
    },

    /**
     * Handle onSubmitQuestion event from gru-question-viewer
     * @see components/player/gru-question-viewer.js
     * @param {Resource} question
     * @param {QuestionResult} questionResult
     */
    submitQuestion: function(question, questionResult){
      const controller = this;
      controller.finishResourceResult(questionResult).then(function(){
        controller.moveOrFinish(question);
      });
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
     * Action triggered when the user open de navigator panel
     */
    openNavigator: function(){
      Ember.$( ".app-container" ).addClass( "navigator-on" );
    },

    /**
     * Action triggered when the user close de navigator panel
     */
    closeNavigator:function(){
      const $appContainer = Ember.$( ".app-container" );
      if ($appContainer.hasClass( "navigator-on" )){
        $appContainer.removeClass( "navigator-on" );
      }
    },

    /**
     * Triggered when an resource emotion is selected
     * @param {string} emotionScore
     */
    changeEmotion: function(emotionScore) {
      let resourceResult = this.get('resourceResult');
      this.saveReactionForResource(resourceResult, emotionScore);
    }
  },

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates when the player has context
   * @property {boolean}
   */
  hasContext: false,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * This property is not used for the context-player
   * @property {string}
   */
  role: null,

  /**
   * Query param indicating if it is a collection or assessment
   * @property {string}
   */
  type: null,

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal("role", "student"),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not("isStudent"),

  /**
   * It contains information about the context where the player is running
   *
   * @see context-player.js route and controller
   *
   * @property {Context}
   */
  context: null,

  /**
   * Query param
   * @property {string} resourceId
   */
  resourceId: null,

  /**
   * The collection presented in this player
   * @property {Collection} collection
   */
  collection: null,

  /**
   * The original collection to remix in the player
   * @property {Collection} collection
   */
  originalCollection: null,

  /**
   * Is Assessment
   * @property {boolean}
   */
  isAssessment: Ember.computed.alias("collection.isAssessment"),

  /**
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * The resource result playing
   * @property {ResourceResult}
   */
  resourceResult: null,

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isResource: Ember.computed("resource", function(){
    const resource = this.get("resource");
    return (resource && !resource.get("isQuestion"));
  }),

  /**
   * @property {boolean} indicates if the answer should be saved
   */
  saveEnabled: true, // save only when logged in

  /**
   * @property {AssessmentResult} assessmentResult
   */
  assessmentResult: null,

  /**
   * Indicates if the report should be displayed
   * @property {boolean} showReport
   */
  showReport: false,

  /**
   * Indicates if the player is notifying the real time
   * @property {boolean}
   */
  notifyingRealTime: false,

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isNotIframeUrl: Ember.computed("resource", function(){
    const resource = this.get("resource");
    return (resource && resource.displayGuide);
  }),
  /**
   * Return the list of resources available to show on the player
   * @property {boolean}
   */
  resourcesPlayer: Ember.computed("collection.resources","assessmentResult.sortedResourceResults", function(){
    var availableResources = this.get('collection.resources').mapBy('id');
    return this.get('assessmentResult.sortedResourceResults').filter(function(item){
       return availableResources.contains(item.resourceId);
    });
  }),

  /**
   * Indicates if the collection should start automatically
   * @property {boolean}
   */
  startAutomatically: Ember.computed("collection", function(){
    const isCollection = this.get("collection.isCollection");
    const hasNoContext = !this.get("hasContext");
    return isCollection || hasNoContext;
  }),

  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods
  /**
   * Moves to the next resource or finishes the collection
   */
  moveOrFinish: function(resource) {
    const controller = this;
    const next = controller.get("collection").nextResource(resource);
    if (next){
      Ember.$(window).scrollTop(0);
      controller.moveToResource(next);
    }
    else{
      controller.finishConfirm();
    }
  },

  /**
   * Moves to resource
   * @param {Resource} resource
   */
  moveToResource: function(resource) {
    const controller = this;
    //if previous item exists
    let promise = controller.get('resourceResult') ?
      controller.finishResourceResult(controller.get('resourceResult')) : Ember.RSVP.resolve();
    promise.then(function() {
      let assessmentResult = controller.get('assessmentResult');
      let resourceId = resource.get('id');
      let resourceResult = assessmentResult.getResultByResourceId(resourceId);
      // wait for it to update
      Ember.run(() => controller.set('resource', null));
      controller.startResourceResult(resourceResult).then(function() {
        controller.setProperties({
          'showReport': false,
          resourceId,
          resource,
          resourceResult
        }); //saves the resource status
      });

    });
  },

  /**
   * Finishes a resource result or submits a question result
   * @param {ResourceResult} resourceResult
   * @param {Date} submittedAt
   * @param {Boolean} isSkip
   * @returns {Promise.<boolean>}
   */
  finishResourceResult: function(resourceResult, submittedAt = new Date(), isSkip = false){
    let controller = this;
    let context = this.get("context");
    let promise = Ember.RSVP.resolve(resourceResult);

    if(!resourceResult.get('submittedAt')) {
      //setting submitted at, timeSpent is calculated
      resourceResult.set('submittedAt', isSkip ? undefined : submittedAt);
      context.set('eventType', 'stop');
      context.set('isStudent', controller.get('isStudent'));
      promise = controller.saveResourceResult(resourceResult, context, isSkip);
    }
    return promise;
  },

  /**
   * Starts a resource result
   * @param {ResourceResult} resourceResult
   * @returns {Promise.<boolean>}
   */
  startResourceResult: function(resourceResult){
    let controller = this;
    let context = this.get("context");
    //sets startedAt
    if (!resourceResult.get("pending")){ //new attempt
      //todo increase attempt
      resourceResult.set("startedAt", new Date());
      context.set("resourceEventId", generateUUID()); //sets the new event id for this resource event
    }
    context.set("eventType", "start");
    context.set("isStudent", controller.get("isStudent"));

    return controller.saveResourceResult(resourceResult, context);
  },

  /**
   * Saves the resource result
   * This method is overriden by context-player controller to communicate with analytics
   * @param resourceResult
   * @param context
   * @returns {Promise.<boolean>}
   */
  saveResourceResult: function(resourceResult, context){
    let controller = this;
    let promise = Ember.RSVP.resolve(resourceResult);
    let save = controller.get('saveEnabled');
    if (save) {
      promise = this.get('eventsService').saveResourceResult(resourceResult, context)
        .then(function() {
          return resourceResult;
        });
    }
    return promise;
  },

  /**
   * Finishes the assessment
   */
  finishCollection: function(){
    let controller = this;
    let assessmentResult = controller.get("assessmentResult");
    let context = controller.get("context");
    let submittedAt = new Date();
    return controller.submitPendingQuestionResults().then(function(){
      context.set("eventType", "stop");
      context.set("isStudent", controller.get("isStudent"));
      assessmentResult.set("submittedAt", submittedAt);
      return controller.saveCollectionResult(assessmentResult, context).then(function() {
        if (!controller.get("session.isAnonymous")) {
          controller.send("navigateToReport");
        }
        else {
          controller.set("showReport", true);
        }
      });
    });
  },

  finishConfirm: function(){
    const controller = this;
    controller.actions.showModal.call(this,
      'content.modals.gru-submit-confirmation',
      {
        onConfirm: controller.finishCollection.bind(controller)
      });
  },

  /**
   * Starts the assessment or collection
   */
  startAssessment: function(){
    let controller = this;
    let collection = controller.get("collection");
    let assessmentResult = controller.get("assessmentResult");
    let context = controller.get("context");
    let promise = Ember.RSVP.resolve(controller.get("collection"));
    controller.set('showContent',true);

    if (! assessmentResult.get("started") ){
      assessmentResult.set("startedAt", new Date());
      context.set("eventType", "start");
      context.set("isStudent", controller.get("isStudent"));
      promise = controller.saveCollectionResult(assessmentResult, context);
    }

    return promise.then(function(){
      let resource = null;
      let hasResources = collection.get("hasResources");
      if (hasResources){
        resource = assessmentResult.get("lastVisitedResource");
        if (controller.get("resourceId")) { //if has a resource id as query param
          resource = collection.getResourceById(controller.get("resourceId"));
        }
      }

      if (resource) {
        controller.moveToResource(resource);
      }
    });
  },

  /**
   * Saves an assessment result event
   * This method is overriden by context-player controller to communicate with analytics
   * @param {AssessmentResult} assessmentResult
   * @param {Context} context
   */
  saveCollectionResult: function(assessmentResult, context){
    return this.get("saveEnabled") ? this.get('eventsService').saveCollectionResult(assessmentResult, context) :
      Ember.RSVP.resolve();
  },


  /**
   * Submits pending question results
   * @returns {Promise}
   */
  submitPendingQuestionResults: function() {
    let controller = this;
    return controller.startNonStartedQuestionResults()
      .then(function() {
        let pendingQuestionResults = controller.get('assessmentResult.pendingQuestionResults');
        let promises = pendingQuestionResults.map(function(questionResult) {
          return controller.finishResourceResult(questionResult, undefined, questionResult.get('skipped'));
        });
        return Ember.RSVP.all(promises);
      });
  },

  startNonStartedQuestionResults: function() {
    let controller = this;
    let questionResults = controller.get('assessmentResult.questionResults');
    let promises = questionResults.filterBy('startedAt', null)
      .map(function(questionResult) {
        return controller.startResourceResult(questionResult);
      });
    return Ember.RSVP.all(promises);
  },

  saveReactionForResource: function(resourceResult, reactionType) {
    const controller = this;
    let eventsService = this.get('eventsService');
    let context = this.get('context');
    if(controller.get("saveEnabled")) {
      context.set("isStudent", controller.get("isStudent"));
      resourceResult.set('reaction', reactionType);   // Sets the reaction value into the resourceResult
      eventsService.saveReaction(resourceResult, context);
    }
  },

  resetValues: function(){
    this.set("resourceId", null);
    this.set("resource", null);
    this.set("resourceResult", null);
    this.set("role", null);
    this.set("notifyingRealTime", false);
  }

});
