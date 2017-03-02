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
  model(params) {
    return this.quizzesModel(params);
  },

  /**
   * @param {{ contextId: string }} params
   */
  quizzesModel(params) {
    const route = this;
    const contextId = params.contextId;
    if(params.token) {
      route.get('quizzesConfigurationService').addProperties({ token: params.token });
    }
    let type = params.type || route.get('quizzesConfigurationService.configuration.properties.type');
    let reportURL = params.routeURL || route.get('quizzesConfigurationService.configuration.properties.reportURL');
    return route.get('quizzesContextService').startContext(contextId).then(function(contextResult){
      return Ember.RSVP.hash({
        contextResult,
        collection: route.get('quizzesCollectionService').readCollection(contextResult.collectionId, type),
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
