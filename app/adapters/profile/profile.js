import Ember from 'ember';
import {DEFAULT_PAGE_SIZE} from 'quizzes/config/config';
import EndPointsConfig from 'quizzes/utils/endpoint-config';

/**
 * Adapter to support the Profile CRUD operations in the API 3.0
 *
 * @typedef {Object} ProfileAdapter
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/profiles',

  usersNamespace: '/api/nucleus-auth/v1/users',

  /**
   * Posts a request to the API to create a new user account
   *
   * @param data user data to be sent in the request body
   * @returns {Promise}
   */
  createProfile: function(data) {
    const adapter = this;
    const endpointUrl = EndPointsConfig.getEndpointSecureUrl();
    const namespace = this.get('usersNamespace');
    const url = `${endpointUrl}${namespace}`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data.body)
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Updates the current user Profile data
   *
   * @param data the request body data
   * @returns {Promise}
   */
  updateMyProfile: function(data) {
    const adapter = this;
    const namespace = adapter.get('usersNamespace');
    const url = `${namespace}/me`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify(data.body)
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the profile information of a given user id
   *
   * @param userId the unique profile user id
   * @returns {Promise}
   */
  readUserProfile: function(userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/demographics`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the profile information of a given user id
   *
   * @param userId the unique profile user id
   * @returns {Promise}
   */
  readUserProfileByUsername: function(username) {
    const adapter = this;
    const namespace = adapter.get('usersNamespace');
    const url = `${namespace}?username=${username}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options).then(function(data){
      return adapter.readUserProfile(data.id);
    });
  },

  /**
   * Follows a user profile
   * @param userId
   * @returns {*|Promise}
   */
  followUserProfile: function (userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/follow`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({"user_id": userId})
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Unfollows a user profile
   * @param userId
   * @returns {*|Promise}
   */
  unfollowUserProfile: function (userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/unfollow`;
    const options = {
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Gets resources by user id
   *
   * @param {string} userId
   * @returns {Promise}
   */
  readResources: function(userId, params = {}) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/resources`;

    const page = params.page || 0;
    const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
    const offset = page * pageSize;
    var data = {
      limit: pageSize,
      offset: offset
    };
    if(params.searchText) {
      data.searchText = params.searchText;
    }
    if(params.sortOn) {
      data.sortOn = params.sortOn;
    }
    if(params.order) {
      data.order = params.order;
    }
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      data,
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets questions by user id
   *
   * @param {string} userId
   * @param {*} params
   * @returns {Promise}
   */
  readQuestions: function(userId, params = {}) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/questions`;

    const page = params.page || 0;
    const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
    const offset = page * pageSize;
    var data = {
      limit: pageSize,
      offset: offset
    };
    if(params.searchText) {
      data.searchText = params.searchText;
    }
    if(params.sortOn) {
      data.sortOn = params.sortOn;
    }
    if(params.order) {
      data.order = params.order;
    }

    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      data,
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets collections by user id
   *
   * @param {string} userId
   * @param {*} params
   * @returns {Promise}
   */
  readCollections: function(userId, params = {}) {

    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/collections`;

    const page = params.page || 0;
    const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
    const offset = page * pageSize;
    var data = {
      limit: pageSize,
      offset: offset
    };
    if(params.filterBy) {
      data.filterBy = params.filterBy;
    }
    if(params.searchText) {
      data.searchText = params.searchText;
    }
    if(params.sortOn) {
      data.sortOn = params.sortOn;
    }
    if(params.order) {
      data.order = params.order;
    }
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      data,
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets assessments by user id
   *
   * @param {string} userId
   * @param {*} params
   * @returns {Promise}
   */
  readAssessments: function(userId, params = {}) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/assessments`;

    const page = params.page || 0;
    const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
    const offset = page * pageSize;
    var data = {
      limit: pageSize,
      offset: offset
    };
    if(params.filterBy) {
      data.filterBy = params.filterBy;
    }
    if(params.searchText) {
      data.searchText = params.searchText;
    }
    if(params.sortOn) {
      data.sortOn = params.sortOn;
    }
    if(params.order) {
      data.order = params.order;
    }
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Start the forgot password workflow
   * @param username
   * @returns {*|Promise}
   */
  forgotPassword: function (email) {
    const adapter = this;
    const namespace = adapter.get('usersNamespace');
    const url = `${namespace}/password-reset`;
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({"email_id": email})
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Resets the user password
   * @param userId
   * @param token
   * @returns {*|Promise}
   */
  resetPassword: function (userId, password, token) {
    const adapter = this;
    const endpointUrl = EndPointsConfig.getEndpointSecureUrl();
    const namespace = adapter.get('usersNamespace');
    const url = `${endpointUrl}${namespace}/${userId}/password`;
    const options = {
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      headers: adapter.defineHeaders(),
      data: JSON.stringify({
        token,
        new_password: password
      })
    };

    return Ember.$.ajax(url, options);
  },

  /**
   * Gets network by user id
   *
   * @param {string} userId
   * @param {string} type - followers or following
   * @returns {Promise}
   */
  readNetwork: function(userId, type) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${userId}/network`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {
        details: type
      }
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Get basic Profile data for a list of profile IDs
   *
   * @param profileIds the list of profile IDs
   * @returns {Promise}
   */
  readMultipleProfiles: function(profileIds) {
    const adapter = this;
    const url = adapter.get('usersNamespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {
        ids: Ember.isArray(profileIds) ? profileIds.join() : null
      }
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      'Authorization': 'Token ' + this.get('session.token-api3')
    };
  }

});
