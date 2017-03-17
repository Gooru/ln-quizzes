import Ember from 'ember';
import ContextResult from 'quizzes-addon/models/result/context';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  quizzesCollectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesContextService: Ember.inject.service('quizzes/context'),

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  // -------------------------------------------------------------------------
  // Actions
  actions:{
    /**
     * When the submission is complete
     */
    onFinish: function() {
      let controller = this.get('controller');
      const reportURL = controller.get('reportURL');
      if(reportURL){
        let url = reportURL.replace('{context-id}', controller.get('contextResult.contextId'));
        window.location.href = url;
      } else {
        this.transitionTo(
          'reports.student-context',
          controller.get('contextResult.contextId')
        );
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
   model(params) {
     return this.quizzesModel(params);
   },

   /**
    * @param {{ contextId: string }} params
    */
   quizzesModel(params) {
     const route = this;
     const resourceId = params.resourceId;
     const contextId = params.contextId;
     let type = params.type || route.get('quizzesConfigurationService.configuration.properties.type');
     let reportURL = params.routeURL || route.get('quizzesConfigurationService.configuration.properties.reportURL');
     let profileId = params.profileId || route.get('quizzesConfigurationService.configuration.properties.profileId');
     let role = params.role || route.get('quizzesConfigurationService.configuration.properties.role') || 'student';
     let isTeacher = role === 'teacher';
     let isAnonymous = profileId === 'anonymous';
     if(type === 'collection' || isAnonymous || isTeacher) {
       return route.get('quizzesContextService').startContext(contextId).then(function(contextResult){
         return Ember.RSVP.hash({
           contextResult,
           collection: route.get('quizzesCollectionService').readCollection(contextResult.collectionId, type),
           reportURL,
           resourceId,
           isAnonymous,
           role
         });
       });
     } else {
       return route.get('quizzesContextService').getAssignedContextById(contextId).then(
           context => !context ? null : route.get('quizzesCollectionService').readCollection(context.collectionId, type).then(
             collection => !collection ? null : route.get('quizzesAttemptService').getAttemptIds(contextId, profileId).then(
               attempts => Ember.RSVP.hash({
                 attempts,
                 collection,
                 context,
                 reportURL,
                 startContextFunction: () => route.startContext(context.id),
                 resourceId,
                 isAnonymous,
                 role
               })
           )
         )
       );
     }
   },

  setupController(controller, model) {
    let collection = model.collection;
    const isAnonymous = model.isAnonymous;
    const isTeacher = model.role === 'teacher';
    let contextResult =  ContextResult.create();
    if(model.resourceId) {
      contextResult.set('currentResourceId', model.resourceId);
    }
    if (collection.get('isCollection') || isAnonymous || isTeacher) {
      contextResult = model.contextResult;
      contextResult.merge(collection);
    } else {
      let context =  model.context;
      context.set('attempts', model.attempts.length);
      contextResult.set('context', context);
      contextResult.set('collection', collection);
      controller.set('isAnonymous', isAnonymous);
      controller.set('role', model.role);
      controller.set('startContextFunction', model.startContextFunction);
    }
    controller.set('contextResult', contextResult);
    controller.set('reportURL', model.reportURL);
  },

  /**
   * @param {string} contextId
   * Starts context to show the player
   */
  startContext:function(contextId){
    const route = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      route.get('quizzesContextService').startContext(contextId).then(resolve, reject);
    });
  }
});
