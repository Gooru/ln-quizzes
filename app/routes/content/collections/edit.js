import Ember from 'ember';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";

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

  collectionService: Ember.inject.service('api-sdk/collection'),

  courseService: Ember.inject.service('api-sdk/course'),

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Methods

  model: function (params) {
    const route = this;
    return route.get('collectionService').readCollection(params.collectionId)
      .then(function(collection) {
        const courseId = collection.get('courseId');
        const isEditing = params.editing;
        var editingContent = (params.editingContent && params.editingContent !=='null') ? params.editingContent : undefined;
        var course = null;

        params.editingContent = editingContent;

        if (courseId) {
          course = route.get('courseService').fetchById(courseId);
        }

        return Ember.RSVP.hash({
          collection: collection,
          course: course,
          isEditing: !!isEditing,
          editingContent: params.editingContent
        });
      });
  },

  setupController(controller, model) {
    controller.set('collection',  model.collection);
    controller.set('course', model.course);
    controller.set('isEditing', model.isEditing);
    controller.set('editingContent', model.editingContent);

    if (model.isEditing || model.editingContent) {
      controller.set('tempCollection', model.collection.copy());
    }
  }
});
