import Ember from 'ember';
import ContextResult from 'quizzes/models/result/context';

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
  attemptService: Ember.inject.service('api-sdk/attempt'),

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  contextService: Ember.inject.service('api-sdk/context'),

  /**
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model(params) {
    const route = this;
    const contextId = params.contextId;
    let type = route.get('configurationService.configuration.properties.type');
    let reportURL = route.get('configurationService.configuration.properties.reportURL');
    const profileId = route.get('configurationService.configuration.properties.profileId');

    if(type === 'collection'){
      return route.get('contextService').startContext(contextId).then(function(contextResult){
        return Ember.RSVP.hash({
          contextResult,
          collection: route.get('collectionService').readCollection(contextResult.collectionId, type),
          reportURL
        });
      });
    } else {
      return route.get('contextService').getAssignedContextById(contextId).then(
          context => !context ? null : route.get('collectionService').readCollection(context.collectionId, type).then(
            collection => !collection ? null : route.get('attemptService').getAttemptIds(contextId, profileId).then(
              attempts => Ember.RSVP.hash({
              attempts,
              collection,
              context,
              reportURL,
              startContextFunction: () => route.startContext(context.id)
            })
          )
        )
      );
    }
  },

  setupController(controller,model) {
    let collection = model.collection;
    let contextResult =  ContextResult.create({collection});
    if (collection.get('isCollection')) {
      contextResult = model.contextResult;
      contextResult.merge(collection);
    } else {
      let context =  model.context;
      context.set('attempts', model.attempts.length);
      contextResult.set('context',context);
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
      route.get('contextService').startContext(contextId).then(resolve, reject);
    });
  }
});
