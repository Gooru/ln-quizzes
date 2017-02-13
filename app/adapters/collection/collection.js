import Ember from 'ember';

export default Ember.Object.extend({

  /**
   * @property {string} End-point URI
   */
  namespace: '/quizzes/api/v1/collections',

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
      contentType: 'application/json; charset=utf-8',
      // TODO get real headers
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'quizzes'
      }
    };
    return Ember.$.ajax(url, options);
  }

});
