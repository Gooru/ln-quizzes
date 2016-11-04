import Ember from 'ember';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

  /**
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @property {Ember.Service} Service to send context related events
   */
  contextService: Ember.inject.service('api-sdk/context'),

  /**
   * @type {EventsService} eventsService
   */
  eventsService: Ember.inject.service('api-sdk/events'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model(params) {
    const route = this;
    const contextId = params.contextId;
    return route.get('contextService').startContext(contextId).then(function(assessmentResult){
      return Ember.RSVP.hash({
        assessmentResult,
        collection: route.get('collectionService').readCollection(assessmentResult.collectionId)
      });
    });
  },

  setupController(controller, model) {
    let assessmentResult = model.assessmentResult;
    let collection = model.collection;
    assessmentResult.merge(collection);
    controller.set('assessmentResult', assessmentResult);
    controller.set('collection', collection);
    controller.startAssessment();
  },

  deactivate: function(){
    this.get('controller').resetValues();
  }
});
