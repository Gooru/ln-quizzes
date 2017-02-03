import Ember from 'ember';
import TokenMixin from 'quizzes/mixins/token';

export default Ember.Object.extend(TokenMixin, {

  /**
   * @property {string} namespace End-point URI
   */
  namespace: '/quizzes/api/v1/profile',

  /**
   * Reads a profile by id
   * @param {String} profileId
   * @returns {Promise}
   */
  readProfile: function(profileId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${profileId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: Object.assign(this.get('headers'), {
        'profile-id': 'd940b802-2407-433b-b409-128dad62b590',
        'lms-id': 'its_learning'
      })
    };
    return Ember.$.ajax(url, options);
  }
});
