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
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  profileService: Ember.inject.service('api-sdk/profile'),

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

    return route.get('contextService').getReportData(contextId).then(
      reportData => Ember.RSVP.hash({
        anonymous,
        reportData,
        collection: route.get('collectionService').readCollection(reportData.collectionId),
        profiles: Ember.RSVP.hash(
          reportData.get('reportEvents').reduce(
            (profiles, reportEvent) => {
              let profileId = reportEvent.profileId;
              if(!(profileId in profiles)) {
                profiles[profileId] = route.get('profileService').readProfile(profileId);
              }
              return profiles;
            }, {}))
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
    reportData.set('collection', collection);
    controller.set('reportData', reportData);
    controller.set('anonymous', anonymous);
  }
});
