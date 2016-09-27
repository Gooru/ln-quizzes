import Ember from 'ember';

/**
 * Adapter to get the User's Current Location
 *
 * @typedef {Object} CurrentLocationAdapter
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  namespace: '/api/nucleus-insights/v2',

  getUserCurrentLocation: function(classId, userId) {
    const adapter = this;
    const namespace = this.get('namespace');
    const url = `${namespace}/class/${classId}/user/${userId}/current/location`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      'gooru-session-token': this.get('session.token-api3')
    };
  }

});
