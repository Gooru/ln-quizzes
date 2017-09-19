import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';

/**
 * Resource Player navigator
 *
 * Component responsible for enabling more flexible navigation options for the player.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-resource-navigator'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Redirect to course map
     */
    redirectCourseMap() {
      if (this.get('classId')) {
        this.get('router').transitionTo(
          'student.class.course-map',
          this.get('classId'),
          { queryParams: { refresh: true } }
        );
      } else {
        this.get(
          'router'
        ).transitionTo('student.independent.course-map', this.get('courseId'), {
          queryParams: { refresh: true }
        });
      }
    },

    /**
     * Go back to collection
     */
    backToCollection() {
      window.location.href = this.get('collectionUrl');
    }
  }
});
