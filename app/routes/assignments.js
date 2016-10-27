import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    isTeacher : {}
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
  let profileId = params.profileId;
    let isTeacher = params.isTeacher;
    return Ember.RSVP.hash({
      profileId,
      isTeacher
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('profileId',model.profileId);
    controller.set('isTeacher',model.isTeacher);
  }
});
