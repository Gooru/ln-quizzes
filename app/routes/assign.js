import Ember from 'ember';

export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} Configuration service
   */
  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function() {

    let studentList = this.get('configurationService.configuration.properties.students');
    let collection = this.get('configurationService.configuration.properties.collection');
    let teacherConfig = this.get('configurationService.configuration.properties.teacher');
    let context = this.get('configurationService.configuration.properties.context');

    return Ember.RSVP.hash({
      studentList,
      collection,
      teacherConfig,
      context
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('studentList', model.studentList);
    controller.set('collection',model.collection);
    controller.set('teacherConfig',model.teacherConfig);
    controller.set('context',model.context);
  }

});

