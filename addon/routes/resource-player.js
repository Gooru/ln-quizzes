import Ember from 'ember';

/**
 * @typedef { Ember.Route } ResourcePlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {resourceService} resourceService
   * @property {Ember.Service} Service to retrieve a collection
   */
  quizzesResourceService: Ember.inject.service('quizzes/resource'),

  /**
   * @type {CollectionService} profileService
   * @property {Ember.Service} Service to retrieve a profile
   */
  profileService: Ember.inject.service('quizzes/profile'),

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
    const resourceId = params.resourceId;
    return this.get('quizzesResourceService').readResource(resourceId).then(resource =>
      Ember.RSVP.hash({
        resource,
        owner: this.getOwnerProfile(resource)
      })
    );
  },

  /**
   * Find owner profile if the resource has narration or is a link out resource
   */
  getOwnerProfile: function(resource) {
    const component = this;
    let promise = Ember.RSVP.resolve();
    let resourceId = resource.ownerId;
    if(resource.get('narration') || resource.get('displayGuide')){
      let profiles = [resourceId];
      promise = component.get('profileService').readProfiles(profiles)
        .then(result => resource.set('owner', result[resourceId]));
    }
    return promise;
  },

  setupController(controller, model) {
    model.resource.set('owner', model.owner);
    controller.set('resource', model.resource);
  }
});
