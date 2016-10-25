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
  model: function() {

    //TODO GET FROM QUIZZES API
    let assignedStudents = ['assigned-1','assigned-2','student-1'];

    let studentList =this.get('configurationService.configuration.properties.students');
    let students = studentList.map(function(student){
      let studentObject = Ember.Object.create(student);
        studentObject.set('isSelected',assignedStudents.includes(student.id));
        return studentObject;
    });

    let collection = this.get('configurationService.configuration.properties.collection');

    return Ember.RSVP.hash({
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
    controller.set('students', model.students);
    controller.set('collection',model.collection);
  }

});

