import Ember from 'ember';

export default Ember.Object.extend({

  namespace: '/quizzes/api/v1/event',

  moveToResource: function(resourceId, contextId, previousResource) {
    const namespace = this.get('namespace');
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
    return Ember.$.ajax(url, options);
  }
});
