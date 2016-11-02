import Ember from 'ember';
import CollectionSerializer from 'quizzes/serializers/collection/collection';
import CollectionAdapter from 'quizzes/adapters/collection/collection';


/**
 * @typedef {Object} CollectionService
 */
export default Ember.Service.extend({

  /**
   * @property {CollectionSerializer} collectionSerializer
   */
  collectionSerializer: null,

  /**
   * @property {CollectionAdapter} collectionAdapter
   */
  collectionAdapter: null,

  init: function () {
    this._super(...arguments);
    this.set('collectionSerializer', CollectionSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('collectionAdapter', CollectionAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Gets a Collection by id
   * @param {string} collectionId
   * @returns {Promise}
   */
  readCollection: function(collectionId){
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('collectionAdapter').readCollection(collectionId)
        .then(function(responseData) {
          resolve(service.get('collectionSerializer').normalizeReadCollection(responseData));
        }, reject );
    });
  }
});
