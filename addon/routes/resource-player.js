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
     return Ember.RSVP.hash({
       resource: this.get('quizzesResourceService').readResource(resourceId)
     });
   },

  setupController(controller, model) {
    controller.set('resource', model.resource);
  }
});
