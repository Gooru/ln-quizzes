import Ember from 'ember';
 import ApplicationAdapter from '../application';

export default ApplicationAdapter.extend({

  /**
   * @property {string} End-point URI
   */
  namespace: '/quizzes/api/v1/collection',

  /**
   * Reads a Collection by id
   *
   * @param {string} collectionId
   * @returns {Promise}
   */
  readCollection: function(collectionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${collectionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8'
    };
    return Ember.$.ajax(url, options);
  }

});
