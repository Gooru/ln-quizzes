import Ember from 'ember';
export default Ember.Route.extend({

  queryParams: {
    isTeacher : {}
  },
  // -------------------------------------------------------------------------
  // Dependencies

  configurationService: Ember.inject.service('configuration'),

  contextService: Ember.inject.service('api-sdk/context'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    let profileId = params.profileId;
    let assignments;
    let studentList = this.get('configurationService.configuration.properties.students');

    let isTeacher = params.isTeacher  === 'true';

    assignments = isTeacher ?  this.get('contextService').getContextsCreated() : this.get('contextService').getContextsAssigned();

    return Ember.RSVP.hash({
      profileId,
      isTeacher,
      assignments,
      studentList
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
    controller.set('assignments',model.assignments);
    controller.set('studentList',model.studentList);
  }
});
