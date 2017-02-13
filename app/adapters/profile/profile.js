import Ember from 'ember';
import TokenMixin from 'quizzes/mixins/token';

export default Ember.Object.extend(TokenMixin, {

  /**
   * @property {string} namespace End-point URI
   */
  namespace: '/api/nucleus/v2/profiles/search',

  /**
   * Reads a profile by id
   * @param {String} profileId
   * @returns {Promise}
   */
  readProfiles: function(profileIds) {
    const namespace = this.get('namespace');
    const url = `${namespace}?userids=${profileIds.join()}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: this.get('headers')
    };
    return Ember.$.ajax(url, options);
  }
});
