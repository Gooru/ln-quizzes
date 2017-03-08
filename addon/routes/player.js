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
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
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
     if(params.token) {
       route.get('quizzesConfigurationService').addProperties({ token: params.token });
     }
     let type = params.type || route.get('quizzesConfigurationService.configuration.properties.type');
     let reportURL = params.routeURL || route.get('quizzesConfigurationService.configuration.properties.reportURL');
     let profileId = params.profileId || route.get('quizzesConfigurationService.configuration.properties.profileId');

     if(type === 'collection' || profileId === 'anonymous') {
       return route.get('quizzesContextService').startContext(contextId).then(function(contextResult){
         return Ember.RSVP.hash({
           contextResult,
           collection: route.get('quizzesCollectionService').readCollection(contextResult.collectionId, type),
           reportURL,
           resourceId,
           isAnonymous: profileId === 'anonymous'
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
                 isAnonymous: profileId === 'anonymous'
               })
           )
         )
       );
     }
   },

  setupController(controller, model) {
    let collection = model.collection;
    const isAnonymous = model.isAnonymous;
    let contextResult =  ContextResult.create();
    if(model.resourceId) {
      contextResult.set('currentResourceId', model.resourceId);
    }
    if (collection.get('isCollection') || isAnonymous) {
      contextResult = model.contextResult;
      contextResult.merge(collection);
    } else {
      let context =  model.context;
      context.set('attempts', model.attempts.length);
      contextResult.set('context', context);
      contextResult.set('collection', collection);
      controller.set('isAnonymous', isAnonymous);
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
