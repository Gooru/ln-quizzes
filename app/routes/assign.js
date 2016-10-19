import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {

  },

  /**
   * Get model for the controller
   */
  model: function(params) {
    let assessmentId = params.assessmentId;

    return Ember.RSVP.hash({
      assessmentId: assessmentId
    });
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

