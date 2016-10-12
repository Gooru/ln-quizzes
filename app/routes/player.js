import Ember from 'ember';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

  /**
   * @type {EventsService} eventsService
   */
  eventsService: Ember.inject.service('api-sdk/events'),

  /**
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @property {Ember.Service} Service to retrieve an asssessment
   */
  assessmentService: Ember.inject.service('api-sdk/assessment'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model(params) {
    const route = this;
    const contextId = params.contextId;
    const collectionId = params.collectionId;
    const type = params.type;
    const isCollection = type === 'collection';
    const isAssessment = type === 'assessment';
    const loadAssessment = !type || isAssessment;
    const loadCollection = !type || isCollection;

    return Ember.RSVP.hashSettled({
      assessment: loadAssessment ? route.get('assessmentService').readAssessment(collectionId) : false,
      collection: loadCollection ? route.get('collectionService').readCollection(collectionId) : false
    }).then(function(hash) {
      let collectionFound = (hash.assessment.state === 'rejected') || (hash.assessment.value === false);
      let collection = collectionFound ? hash.collection.value : hash.assessment.value;
      return Ember.RSVP.hash({
        assessmentResult: route.get('eventsService').startContext(contextId),
        collection: collection.toPlayerCollection()
      })
    });
  },

  setupController(controller, model) {
    let assessmentResult = model.assessmentResult;
    let collection = model.collection;
    // TODO change may be needed when quizzes endpoint to retrieve resources is ready
    assessmentResult.merge(collection);
    controller.set('assessmentResult', assessmentResult);
    controller.set('collection', collection);
    controller.startAssessment();
  },

  deactivate: function(){
    this.get('controller').resetValues();
  }
});
