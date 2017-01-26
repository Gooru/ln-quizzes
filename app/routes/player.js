import Ember from 'ember';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

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

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model(params) {
    const route = this;
    const contextId = params.contextId;
    return route.get('contextService').startContext(contextId).then(function(contextResult){
      return Ember.RSVP.hash({
        contextResult,
        collection: route.get('collectionService').readCollection(contextResult.collectionId)
      });
    });
  },

  setupController(controller, model) {
    let contextResult = model.contextResult;
    let collection = model.collection;
    contextResult.merge(collection);
    controller.set('contextResult', contextResult);
    controller.set('collection', collection);
  }
});
