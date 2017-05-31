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
  // Actions

  actions:{
    /**
     * Action triggered when the user clicks on next
     */
    onNext: function() {
      // Empty, it does nothing by default
    }
  },

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
    const {
      resourceId,
      pathId,
      source,
      classId,
      courseId,
      unitId,
      lessonId,
      collectionId
    } = params;
    return this.get('quizzesResourceService').readResource(resourceId).then(resource =>
      Ember.RSVP.hash({
        resource,
        owner: this.getOwnerProfile(resource),
        pathId,
        source,
        classId,
        courseId,
        unitId,
        lessonId,
        collectionId
      })
    );
  },

  /**
   * Find owner profile if the resource has narration or is a link out resource
   */
  getOwnerProfile: function(resource) {
    const component = this;
    let promise = Ember.RSVP.resolve();
    let ownerId = resource.ownerId;
    if(resource.get('narration') || resource.get('displayGuide')){
      let profiles = [ownerId];
      promise = component.get('profileService').readProfiles(profiles)
        .then(result => resource.set('owner', result[ownerId]));
    }
    return promise;
  },

  setupController(controller, model) {
    model.resource.set('owner', model.owner);
    controller.setProperties({
      resource: model.resource,
      classId: model.classId,
      courseId: model.courseId,
      unitId: model.unitId,
      lessonId: model.lessonId,
      collectionId: model.collectionId,
      pathId: model.pathId,
      source: model.source
    });
  }
});
