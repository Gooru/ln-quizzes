import Ember from 'ember';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for context events
 * from BE to the controller
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

    return route.get('contextService').getReportData(contextId).then(
      reportData => Ember.RSVP.hash({
        reportData,
        collection: route.get('collectionService').readCollection(reportData.collectionId)
      })
    );
  },

  setupController(controller, model) {
    let collection = model.collection;
    let reportData = model.reportData;
    reportData.set('collection', collection);
    controller.set('reportData', reportData);
  }
});
