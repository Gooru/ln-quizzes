import Ember from 'ember';

/**
 * Route for student report
 *
 * Gathers and passes initialization data for attempt events
 * from BE to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

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
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Navigate to the previous page
     */
    navigateBack: function () {
      window.history.back();
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model: function (params) {
    const route = this;
    const contextId = params.contextId;
    const profileId = '';
    const type = route.get('configurationService.configuration.properties.type');

    return route.get('attemptService').getAttemptIds(contextId, profileId).then(
      attemptIds => !attemptIds || !attemptIds.length ? null :
          route.get('attemptService').getAttemptData(attemptIds[0]).then(
            attemptData => Ember.RSVP.hash({
              attemptData,
              collection: route.get('collectionService').readCollection(attemptData.collectionId, type)
            })
          )
    );
  },

  setupController(controller, model) {
    let collection = model.collection;
    let attemptData = model.attemptData;
    attemptData.setCollection(collection);
    controller.set('attemptData', attemptData);
  }

});
