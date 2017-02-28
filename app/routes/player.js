import Ember from 'ember';

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
    return route.get('contextService').startContext(contextId).then(function(contextResult){
      return Ember.RSVP.hash({
        contextResult,
        collection: route.get('collectionService').readCollection(contextResult.collectionId, type),
        reportURL
      });
    });
  },

  setupController(controller, { contextResult, collection, reportURL }) {
    contextResult.merge(collection);
    controller.set('contextResult', contextResult);
    controller.set('collection', collection);
    controller.set('reportURL', reportURL);
  }
});
