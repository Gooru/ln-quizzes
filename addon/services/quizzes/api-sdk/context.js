import Ember from 'ember';
import ContextSerializer from 'quizzes-addon/serializers/context/context';
import ContextAdapter from 'quizzes-addon/adapters/context/context';

export default Ember.Service.extend({

  init: function () {
    this._super(...arguments);
    this.set('contextAdapter', ContextAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('contextSerializer', ContextSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {EventsAdapter} adapter
   */
  contextAdapter: null,

  /**
   * @property {EventsSerializer} serializer
   */
  contextSerializer: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Creates a context
   * @param {Context} assignment
   * @returns {Promise}
   */
  createContext: function(assignment) {
    const service = this;
    let serializedAssignment = service.get('contextSerializer').serializeContext(assignment);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').createContext(serializedAssignment).then(resolve, reject);
    });
  },

  /**
   * Gets all the contexts assigned to the current student
   * @returns {Promise}
   */
  getContextsAssigned: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').getContextsAssigned()
        .then(response => service.get('contextSerializer').normalizeReadContexts(response))
        .then(resolve, reject);
    });
  },

  /**
   * Gets all contexts created by the current teacher
   * @returns {Promise}
   */
  getContextsCreated: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').getContextsCreated()
        .then(response => service.get('contextSerializer').normalizeReadContexts(response))
        .then(resolve, reject);
    });
  },

  /**
   * Save the previous resource response and current resource
   * @param {String} resourceId current resource
   * @param {String} contextId
   * @param {Object} previousResource resource to save
   * @returns {Promise}
   */
  moveToResource: function(resourceId, contextId, previousResult) {
    const service = this;
    let serializedPreviousResult = previousResult ?
      this.get('contextSerializer').serializeResourceResult(previousResult) :
      null;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').moveToResource(resourceId, contextId, serializedPreviousResult)
        .then(resolve, reject);
    });
  },

  /**
   * Send event to notify the student started an assignment
   * @param {String} contextId
   * @returns {Promise}
   */
  startContext: function(contextId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').sendStartContextEvent(contextId)
        .then(response => service.get('contextSerializer').normalizeContextResult(response))
        .then(resolve, reject);
    });
  },

  /**
   * Send event to notify the student submitted all questions in an assignment
   * @param {String} contextId
   * @returns {Promise}
   */
  finishContext: function(contextId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').sendFinishContextEvent(contextId)
        .then(resolve, reject);
    });
  },

  /**
   * Update an assignment/context
   * @param {Context} assignment
   * @returns {Promise}
   */
  updateContext: function(assignment) {
    const service = this;
    let serializedAssignment = this.get('contextSerializer').serializeUpdateContext(assignment);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').updateContext(
        serializedAssignment, assignment.get('id')).then(resolve, reject);
    });
  }
});
