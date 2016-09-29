import Ember from 'ember';
import PrivateRouteMixin from "quizzes/mixins/private-route-mixin";
import EditResourceValidations from 'quizzes/validations/edit-resource';
import Resource from 'quizzes/models/content/resource';

export default Ember.Route.extend(PrivateRouteMixin, {
  queryParams: {
    collectionId: {},
    editing: {}
  },

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:api-sdk/resource
   */
  resourceService: Ember.inject.service("api-sdk/resource"),

  /**
   * @requires service:api-sdk/collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @requires service:session
   */
  session: Ember.inject.service("session"),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Events
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('collectionId', undefined);
      controller.set('isCollection', undefined);
    }
  },



  // -------------------------------------------------------------------------
  // Methods

  model: function (params) {
    const route = this;

    var resource = route.get('resourceService').readResource(params.resourceId).then(function(resource){
      return route.get('profileService').readUserProfile(resource.owner).then(function(owner){
        var EditResourceValidation = Resource.extend(EditResourceValidations);
        var editResource = EditResourceValidation.create(Ember.getOwner(route).ownerInjection());
        // standards and info are not coming inside modelProperties
        var properties = resource.modelProperties().concat(['standards', 'info']);
        editResource.merge(resource, properties);
        editResource.set('owner', owner);
        return editResource;
      });
    });

    var isEditing = params.editing;
    var collection = null;

    if (params.collectionId) {
      collection = route.get('collectionService').readCollection(params.collectionId);
    }

    return Ember.RSVP.hash({
      resource: resource,
      collection: collection,
      isEditing: !!isEditing
    });
  },

  setupController(controller, model) {
    controller.set('resource', model.resource);
    controller.set('collection', model.collection);
    controller.set('isEditing', model.isEditing);

    if (model.isEditing) {
      controller.set('tempResource', model.resource.copy());
    }
  }
});
