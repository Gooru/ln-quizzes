import Ember from 'ember';
import PrivateRouteMixin from "quizzes/mixins/private-route-mixin";

export default Ember.Route.extend(PrivateRouteMixin, {
  queryParams: {
    editing:{},
    editingContent:{
      refreshModel: true
    }
  },

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Session} current session
   */
  session: Ember.inject.service("session"),

  assessmentService: Ember.inject.service('api-sdk/assessment'),

  courseService: Ember.inject.service('api-sdk/course'),

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Methods

  model: function (params) {
    const route = this;
    return route.get('assessmentService').readAssessment(params.assessmentId)
      .then(function(assessment) {
        const courseId = assessment.get('courseId');
        const isEditing = params.editing;
        const editingContent = params.editingContent ? params.editingContent : null;
        var course = null;

        if (courseId) {
          course = route.get('courseService').fetchById(courseId);
        }

        return Ember.RSVP.hash({
          assessment: assessment,
          course: course,
          isEditing: !!isEditing,
          editingContent: editingContent
        });
      });
  },

  setupController(controller, model) {
    // Since assessment is a collection with only questions, we'll reuse the same components
    // for collections (for example, see: /app/components/content/assessments/gru-assessment-edit.js)
    // and that is why the property 'collection' is being reused here, too.
    controller.set('collection', model.assessment);
    controller.set('course', model.course);
    controller.set('isEditing', model.isEditing);
    controller.set('editingContent', model.editingContent);
    controller.set('isAssessment', true);

    if(model.isEditing || model.editingContent ) {
      controller.set('tempCollection', model.assessment.copy());
    }
  }
});
