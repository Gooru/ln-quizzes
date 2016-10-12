import Ember from 'ember';

export default Ember.Object.extend({

  namespace: '/quizzes/api/v1/event',

  sendStartContextEvent: function(contextId) {
    /*const namespace = this.get('namespace');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({})
    };

    const url = `${namespace}/start/context/${contextId}`;
    return Ember.$.ajax(url, options);*/
    return Ember.RSVP.resolve({
      contextId: 1
    });
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

    const url = `${namespace}/end/context/${contextId}`;
    return Ember.$.ajax(url, options);
  },

  moveToResource: function(resourceId, contextId, previousResource) {
    /*const namespace = this.get('namespace');
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({
        previousResource
      })
    };

    const url = `${namespace}/on-resource/${resourceId}/context/${contextId}`;
    return Ember.$.ajax(url, options);*/
    return new Ember.RSVP.Promise(function(resolve) {
      console.log(resourceId, contextId, previousResource);
      resolve();
    });
  }
});
