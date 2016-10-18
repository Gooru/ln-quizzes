import Ember from 'ember';
export default Ember.Controller.extend({

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    updateClass: function(classId) {
      const controller = this;
      controller.send('updateUserClasses'); // Triggers the refresh of user classes in top header
      controller.transitionToRoute('class.overview', classId);
    }
  }
});
