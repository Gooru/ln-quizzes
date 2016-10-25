import Ember from 'ember';

export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    let assessmentId = params.assessmentId;
    //TODO GET FROM QUIZZES
    let assignedStudents = ['assigned-1','assigned-2','student-1'];

    let studentList = this.get('configurationService.configuration.properties.students');
    let students = studentList.map(function(student){
        student.isSelected = assignedStudents.includes(student.id);
        return student;
    });

    let collection = this.get('configurationService.configuration.properties.collection');

    return Ember.RSVP.hash({
      assessmentId,
      students,
      collection
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('assessmentId', model.assessmentId);
    controller.set('students', model.students);
    controller.set('collection',model.collection);
  }

});

