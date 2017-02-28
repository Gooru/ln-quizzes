import Ember from 'ember';

export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  attemptService: Ember.inject.service('api-sdk/attempt'),

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
    const profileId = route.get('configurationService.configuration.properties.profileId');
    const type = route.get('configurationService.configuration.properties.type');

    return route.get('contextService').getAssignedContextById(contextId).then(
        context => !context ? null : route.get('collectionService').readCollection(context.collectionId, type).then(
          collection => !collection ? null : route.get('attemptService').getAttemptIds(contextId, profileId).then(
              attempts => Ember.RSVP.hash({
                attempts,
                collection,
                context
            })
          )
        )
    );
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('attempts',model.attempts);
    controller.set('collection',model.collection);
    controller.set('context',model.context);
  }
});
