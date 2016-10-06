import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';

export default Ember.Route.extend(ModalMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Remix course action, when clicking remix at the course card
     * @param {Content/Course}
     */
    remixCourse: function(course){
      var remixModel = {
        content: course
      };
      this.send('showModal', 'content.modals.gru-course-remix', remixModel);
    }
  },
  // -------------------------------------------------------------------------
  // Methods

  setupController: function (controller) {
    controller.set('courses', []);
  }

});
