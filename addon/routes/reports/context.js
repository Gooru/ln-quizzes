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

  queryParams: {
    anonymous : {}
  },

  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  attemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  profileService: Ember.inject.service('quizzes/profile'),

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
    const anonymous = params.anonymous;
    const type = params.type || route.get('configurationService.configuration.properties.type');

    return route.get('attemptService').getReportData(contextId).then(
      reportData => Ember.RSVP.hash({
        anonymous,
        reportData,
        collection: route.get('collectionService').readCollection(reportData.collectionId, type),
        profiles: route.get('profileService').readProfiles(
          reportData.get('reportEvents').map(({ profileId }) => profileId)
        )
      })
    );
  },

  setupController(controller, model) {
    let anonymous = model.anonymous;
    let collection = model.collection;
    let reportData = model.reportData;
    let profiles = model.profiles;
    reportData.get('reportEvents').forEach(function(reportEvent) {
      let profile = profiles[reportEvent.get('profileId')];
      reportEvent.setProfileProperties(profile);
    });
    reportData.setCollection(collection);
    controller.set('reportData', reportData);
    controller.set('anonymous', anonymous);
  }
});
