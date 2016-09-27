import Ember from 'ember';
import BuilderItem from 'gooru-web/models/content/builder/item';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";

export default Ember.Route.extend(PrivateRouteMixin, {

  queryParams: {
    editing:{}
  },

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/course
   */
  courseService: Ember.inject.service("api-sdk/course"),

  /**
   * @requires service:session
   */
  session: Ember.inject.service("session"),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  model: function (params) {
    var course = this.get('courseService').fetchById(params.courseId);
    var isEditing = params.editing;

    return Ember.RSVP.hash({
      course: course,
      isEditing: !!isEditing
    });
  },

  setupController(controller, model) {
    var course = model.course;

    course.children = course.children.map(function (unit) {
      // Wrap every unit inside of a builder item
      return BuilderItem.create({
        data: unit
      });
    });

    controller.set('course', course);
    controller.set('isEditing', model.isEditing);
    if(model.isEditing) {
      controller.set('tempCourse', course.copy());
    }
  }
});
