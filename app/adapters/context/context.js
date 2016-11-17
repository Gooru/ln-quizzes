import Ember from 'ember';

export default Ember.Object.extend({

  namespace: '/quizzes/api/v1/context',

  namespaceCollection: '/quizzes/api/v1/contexts',

  createContext:function(assignment){
    const namespace = this.get('namespace');
    const url = `${namespace}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data:JSON.stringify(assignment),
      // TODO get real headers
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'its_learning'
      }
    };
    return Ember.$.ajax(url, options);
  },
  getContextsCreated:function(){
    const namespace = this.get('namespaceCollection');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'its_learning'
      }
    };
    const url = `${namespace}/created`;
    return Ember.$.ajax(url, options);
  },
  moveToResource: function(resourceId, contextId, previousResource) {
    const namespace = this.get('namespace');
    let data = {};
    if(previousResource) {
      data = {
        previousResource
      };
    }
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(data),
      // TODO get real headers
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'quizzes'
      }
    };
    const url = `${namespace}/${contextId}/event/on-resource/${resourceId || ''}`;
    return Ember.$.ajax(url, options);
  },

  sendStartContextEvent: function(contextId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}/event/start`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({}),
      // TODO get real headers
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'quizzes'
      }
    };
    return Ember.$.ajax(url, options);
  },

  sendEndContextEvent: function(contextId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}/event/end`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({}),
      // TODO get real headers
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'quizzes'
      }
    };
    return Ember.$.ajax(url, options);
  },
  updateContext: function(data,contextId){
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data:JSON.stringify(data),
      // TODO get real headers
      headers: {
        'profile-id': '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        'lms-id': 'quizzes'
      }
    };
    return Ember.$.ajax(url, options);
  }
});
