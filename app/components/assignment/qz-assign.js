import Ember from 'ember';
import Profile from 'quizzes/models/profile/profile';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Events
  init: function() {
    this._super(...arguments);
    //let profilesList = this.get('studentList').map(function(student){
    //  let studentObject = Profile.create(student);
    //  studentObject.set('isAssigned',false);
    //  return studentObject;
    //});
    //this.set('students',profilesList);

    this.set('teacher',Profile.create({
      id: this.get('teacherConfig.id'),
      firstName:this.get('teacherConfig.firstName'),
      lastName:this.get('teacherConfig.lastName'),
      username:this.get('teacherConfig.username'),
      email:this.get('teacherConfig.email')
    }));
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * Owner of the assignment
   */
  teacher: null,
  /**
   * Student list
   */
  students:null

});
