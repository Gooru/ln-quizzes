import Ember from 'ember';
import TokenMixin from 'quizzes/mixins/token';

export default Ember.Object.extend(TokenMixin, {

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
  readCollection: function(collectionId,type) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${collectionId}?type=${type}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: Object.assign(this.get('headers'), {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'its_learning'
      })
    };
    return Ember.$.ajax(url, options);
  }

});
