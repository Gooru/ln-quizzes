import Ember from 'ember';
import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin, {

  /**
   * @property {Object} namespace base url for context endpoints
   */
  namespace: '/quizzes/api/v1/contexts',

  /**
   * Creates a context
   * @param {Object} assignment
   * @returns {Promise}
   */
  createContext: function(assignment) {
    const namespace = this.get('namespace');
    const url = `${namespace}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(assignment),
      headers: Object.assign(this.get('headers'), {
        'profile-id': '7973e6c6-f0cd-4021-9c49-a0f9f26101b2',
        'lms-id': 'its_learning'
      })
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Gets all the contexts assigned to the current student
   * @returns {Promise}
   */
  getContextsAssigned: function() {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: Object.assign(this.get('headers'), {
        'profile-id': '8856379a-a8c9-402d-b1b0-faae3b36d137',
        'lms-id': 'its_learning'
      })
    };
    const url = `${namespace}/assigned`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Gets all contexts created by the current teacher
   * @returns {Promise}
   */
  getContextsCreated: function() {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: Object.assign(this.get('headers'), {
        'profile-id': '7973e6c6-f0cd-4021-9c49-a0f9f26101b2',
        'lms-id': 'its_learning'
      })
    };
    const url = `${namespace}/created`;
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Save the previous resource response and current resource
   * @param {String} resourceId current resource
   * @param {String} contextId
   * @param {Object} previousResource resource to save
   * @returns {Promise}
   */
  moveToResource: function(resourceId, contextId, previousResource) {
    const namespace = this.get('namespace');
    let data = previousResource ? { previousResource } : {};
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify(data),
      headers: Object.assign(this.get('headers'), {
        'profile-id': '8856379a-a8c9-402d-b1b0-faae3b36d137',
        'lms-id': 'its_learning'
      })
    };
    const resourceIdParam = resourceId || previousResource.resourceId;
    const url = `${namespace}/${contextId}/onResource/${resourceIdParam}`;
    return this.sendAjaxRequest(url, options);
  },


/**
   * Send event to notify the student submitted all questions in an assignment
   * @param {String} contextId
   * @returns {Promise}
   */
  sendFinishContextEvent: function(contextId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}/finish`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({}),
      headers: Object.assign(this.get('headers'), {
        'profile-id': '8856379a-a8c9-402d-b1b0-faae3b36d137',
        'lms-id': 'its_learning'
      })
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Send event to notify the student started an assignment
   * @param {String} contextId
   * @returns {Promise}
   */
  sendStartContextEvent: function(contextId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}/start`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify({}),
      headers: Object.assign(this.get('headers'), {
        'profile-id': '8856379a-a8c9-402d-b1b0-faae3b36d137',
        'lms-id': 'its_learning'
      })
    };
    return this.sendAjaxRequest(url, options);
  },

  /**
   * Update an assignment/context
   * @param {Object} data
   * @param {String} contextId
   * @returns {Promise}
   */
  updateContext: function(data, contextId) {
    const namespace = this.get('namespace');
    const url = `${namespace}/${contextId}`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      data: JSON.stringify(data),
      headers: Object.assign(this.get('headers'), {
        'profile-id': '7973e6c6-f0cd-4021-9c49-a0f9f26101b2',
        'lms-id': 'its_learning'
      })
    };
    return this.sendAjaxRequest(url, options);
  }
});
