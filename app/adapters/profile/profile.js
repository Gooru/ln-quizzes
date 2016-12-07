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
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'its_learning'
      }
    };
    return Ember.$.ajax(url, options);
  }
});
