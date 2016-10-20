import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    let assessmentId = params.assessmentId;

    return Ember.RSVP.hash({assessmentId});
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('assessmentId', model.assessmentId);
  }

});

