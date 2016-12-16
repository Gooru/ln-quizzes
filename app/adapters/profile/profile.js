import Ember from 'ember';

export default Ember.Object.extend({

  namespace: '/quizzes/api/v1/profile',

  readProfile: function(profileId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${profileId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      // TODO get real headers
      headers: {
        'profile-id': 'd940b802-2407-433b-b409-128dad62b590',
        'lms-id': 'its_learning'
      }
    };
    return Ember.$.ajax(url, options);
  }
});
