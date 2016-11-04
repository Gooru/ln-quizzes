import Ember from 'ember';
import ResourceSerializer from 'quizzes/serializers/resource/resource';
import CollectionModel from 'quizzes/models/collection/collection';

/**
 * Serializer for Collection
 *
 * @typedef {Object} CollectionSerializer
 */
export default Ember.Object.extend({

  /**
   * @property {ResourceSerializer} resourceSerializer
   */
  resourceSerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('resourceSerializer', ResourceSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Normalize the Collection data into a Collection object
   * @param payload
   * @returns {Question}
   */
  normalizeReadCollection: function(payload) {
    const serializer = this;
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.id,
      isCollection: payload.isCollection,
      title: payload.title,
      resources: serializer.normalizeResources(payload.resources)
    });
  },

  /**
   * Normalize the resources from a collection
   * @param payload
   * @returns {Resource}
   */
  normalizeResources: function(payload) {
    return Ember.isArray(payload)
      ? payload.map(resource => this.get('resourceSerializer').normalizeReadResource(resource))
      : [];
  }
});
