import Ember from 'ember';
import CollectionSerializer from 'quizzes-addon/serializers/collection/collection';
import CollectionAdapter from 'quizzes-addon/adapters/collection/collection';


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
   * @param {type} Collection Type
   * @returns {Promise}
   */
  readCollection: function(collectionId,type){
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('collectionAdapter').readCollection(collectionId,type)
        .then(function(responseData) {
          resolve(service.get('collectionSerializer').normalizeReadCollection(responseData));
        }, reject );
    });
  }
});
