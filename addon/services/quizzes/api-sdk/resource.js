import Ember from 'ember';
import ContextSerializer from 'quizzes-addon/serializers/context/context';
import ResourceSerializer from 'quizzes-addon/serializers/resource/resource';
import ResourceAdapter from 'quizzes-addon/adapters/resource/resource';

export default Ember.Service.extend({

  init: function () {
    this._super(...arguments);
    this.set('resourceAdapter', ResourceAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('resourceSerializer', ResourceSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('contextSerializer', ContextSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ResourceAdapter} adapter
   */
  resourceAdapter: null,

  /**
   * @property {ResourceSerializer} serializer
   */
  resourceSerializer: null,

  /**
   * @property {ContextSerializer} contextSerializer
   */
  contextSerializer: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Reads a resource by id
   * @param {String} resourceId
   * @returns {Promise}
   */
  sendFinishResource: function(resourceId, resourceResult, pathId, source, cul) {
    const service = this;
    let eventData = this.get('contextSerializer').serializeResourceResult(resourceResult, false);
    let eventContext = this.get('contextSerializer').serializeEventContext(source, pathId, null, cul);
    return new Ember.RSVP.Promise((resolve, reject) =>
      service.get('resourceAdapter')
        .sendFinishResource(resourceId, eventData, eventContext)
        .then(resolve, reject)
    );
  },

  /**
   * Reads a resource by id
   * @param {String} resourceId
   * @returns {Promise}
   */
  readResource: function(resourceId) {
    const service = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      service.get('resourceAdapter').readResource(resourceId)
        .then(response => {
          response.isResource = true;
          return service.get('resourceSerializer').normalizeReadResource(response);
        })
        .then(resolve, reject);
    });
  }
});
