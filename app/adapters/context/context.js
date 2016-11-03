import Ember from 'ember';

export default Ember.Object.extend({

  namespace: '/quizzes/api/v1/context',

  sendStartContextEvent: function(contextId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({})
    };

    const url = `${namespace}/${contextId}/event/start`;
    return Ember.$.ajax(url, options);
  },

  sendEndContextEvent: function(contextId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({})
    };

    const url = `${namespace}/${contextId}/event/end`;
    return Ember.$.ajax(url, options);
  }
});
