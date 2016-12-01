import Ember from 'ember';
import Profile from 'quizzes/models/profile/profile';

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

    let students = studentList.map(function(student){
      let studentObject = Profile.create(student);
        studentObject.set('isSelected',false);
        return studentObject;
    });

    let collection = this.get('configurationService.configuration.properties.collection');
    let teacherConfig = this.get('configurationService.configuration.properties.teacher');

    let teacher = Profile.create({
      id: teacherConfig.id,
      firstName:teacherConfig.firstName,
      lastName:teacherConfig.lastName,
      username:teacherConfig.username
    });
    let context = this.get('configurationService.configuration.properties.context');

    return Ember.RSVP.hash({
      students,
      collection,
      teacher,
      context
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
    controller.set('teacher',model.teacher);
    controller.set('context',model.context);
  }

});

