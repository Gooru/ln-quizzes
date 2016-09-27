import Ember from 'ember';
import AssessmentResult from 'gooru-web/models/result/assessment';
import Context from 'gooru-web/models/result/context';
import {generateUUID} from 'gooru-web/utils/utils';
import ModalMixin from 'gooru-web/mixins/modal';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend(ModalMixin,{

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service("session"),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Actions
  actions:{
    /**
     * When closing the player
     */
    closePlayer: function(){
      const $appContainer = Ember.$( ".app-container" );
      if ($appContainer.hasClass( "navigator-on" )){
        $appContainer.removeClass( "navigator-on" );
      }
      var route = !this.get('history.lastRoute.name') ? 'index' : this.get('history.lastRoute.url');
      this.transitionTo(route);
    },

    startAssessment: function(){
      const controller = this.get("controller");
      controller.startAssessment();
    },

    /**
     * Navigates to the assessment report
     */
    navigateToReport: function (){
      const route = this;
      const controller = route.get("controller");
      let context = controller.get("context");
      let collection = controller.get("collection");
      const queryParams = {
        collectionId: context.get("collectionId"),
        userId: controller.get('session.userId'),
        type: collection.get("collectionType"),
        role: controller.get("role")
      };
      if (context.get("classId")) {
        queryParams.classId = context.get("classId");
        queryParams.courseId = context.get("courseId");
        queryParams.unitId = context.get("unitId");
        queryParams.lessonId = context.get("lessonId");
      }

      const reportController = route.controllerFor('reports.student-collection');

        //this doesn't work when refreshing the page, TODO
      reportController.set("backUrl", route.get('history.lastRoute.url'));
      route.transitionTo('reports.student-collection', { queryParams: queryParams});
    },

    /**
     * On navigator remix collection button click
     * @param {Collection} collection
     */
    remixCollection: function (collection) {
      var remixModel = {
        content: collection
      };
      if(collection.get('isCollection')) {
        this.send('showModal', 'content.modals.gru-collection-remix', remixModel);
      } else {
        this.send('showModal', 'content.modals.gru-assessment-remix', remixModel);
      }
    }

  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Ember.Service} Service to rate a resource
   */
  ratingService: Ember.inject.service("api-sdk/rating"),

  /**
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service("api-sdk/collection"),

  /**
   * @property {Ember.Service} Service to retrieve an asssessment
   */
  assessmentService: Ember.inject.service("api-sdk/assessment"),

  /**
   * @property {Ember.Service} Service to retrieve an assessment result
   */
  performanceService: Ember.inject.service("api-sdk/performance"),

  /**
   * @property {Ember.Service} Service to retrieve an assessment result
   */
  userSessionService: Ember.inject.service("api-sdk/user-session"),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * @param {{ collectionId: string, resourceId: string }} params
   */
  model(params) {
    const route = this;
    const context = route.getContext(params);
    const collectionId = context.get("collectionId");
    const type = params.type;
    const isCollection = type === 'collection';
    const isAssessment = type === 'assessment';

    const loadAssessment = !type || isAssessment;
    const loadCollection = !type || isCollection;

    return Ember.RSVP.hashSettled({
      assessment: loadAssessment ? route.get('assessmentService').readAssessment(collectionId) : false,
      collection: loadCollection ? route.get('collectionService').readCollection(collectionId) : false
    }).then(function(hash) {
      let collectionFound = (hash.assessment.state === 'rejected') || (hash.assessment.value === false);
      let collection = collectionFound ? hash.collection.value : hash.assessment.value;

      const playerCollection = collection.toPlayerCollection();

      //Find resource owners
      playerCollection.get("resources").map(function(resource){
        if(resource.owner){
          return route.get('profileService').readUserProfile(resource.owner).then(function(owner){
            return resource.set('owner',owner);
          });
        }
      });
      context.set("collectionType", collection.get("collectionType"));
      return route.playerModel(params, context, playerCollection, collection);
    });
  },

  /**
   * Gets player model
   * @param {*} params
   * @param {Context} context
   * @param {Collection} collection
   * @returns {Promise.<*>}
   */
  playerModel: function(params, context, collection, originalCollection){
    const route = this;
    const hasUserSession = !route.get('session.isAnonymous');
    const isAssessment = collection.get("isAssessment");
    const loadSession = hasUserSession && isAssessment;

    let lastOpenSessionPromise = loadSession ?
      route.get("userSessionService").getOpenSession(context) :
      Ember.RSVP.resolve(null);

    return lastOpenSessionPromise.then(function (lastSession) {
      //Setting new content if we have some session opened
      context.set('sessionId', lastSession ? lastSession.sessionId : null);

      let assessmentResult = (lastSession) ?
        route.get("performanceService").findAssessmentResultByCollectionAndStudent(context) : null;
      return Ember.RSVP.hash({
        collection: collection,
        resourceId: params.resourceId,
        assessmentResult: assessmentResult,
        context: context,
        originalCollection: originalCollection
      });
    });
  },

  /**
   * Get the player context
   * @param params
   * @returns {Context}
   */
  getContext: function(params){
    const route = this;
    const userId = route.get('session.userId');
    const collectionId = params.collectionId;

    return Context.create({
      userId: userId,
      collectionId: collectionId,
      parentEventId: generateUUID() //TODO is this comming from BE?
    });
  },

  /**
   * @param {PlayerController} controller
   * @param {Collection} model
   */
  setupController(controller, model) {
    let collection = model.collection;
    let originalCollection = model.originalCollection;
    let assessmentResult = model.assessmentResult;
    let hasUserSession = !this.get('session.isAnonymous');

    if (!assessmentResult){
      assessmentResult = AssessmentResult.create({
        totalAttempts: 1,
        sessionId: generateUUID(), //sessionId for new assessment
        selectedAttempt: 1,
        resourceResults: Ember.A([])
      });
      Ember.Logger.debug('No assessment results found. Assessment result was created.');
    }
    assessmentResult.merge(collection);

    model.context.set("sessionId", assessmentResult.get("sessionId"));

    controller.set("saveEnabled", hasUserSession);
    controller.set("context", model.context);
    controller.set("assessmentResult", assessmentResult);

    controller.set("showReport", assessmentResult.get("submitted"));
    controller.set("collection", collection);
    controller.set("originalCollection", originalCollection);

    if (controller.get("startAutomatically")){
      controller.startAssessment();
    }
  },

  deactivate: function(){
    this.get("controller").resetValues();
  }
});
