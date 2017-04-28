import Ember from 'ember';
import ProfileSerializer from 'quizzes-addon/serializers/resource/resource';
import ProfileAdapter from 'quizzes-addon/adapters/resource/resource';

export default Ember.Service.extend({

  init: function () {
    this._super(...arguments);
    this.set('resourceAdapter', ProfileAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('resourceSerializer', ProfileSerializer.create(Ember.getOwner(this).ownerInjection()));
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

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Reads a resource by id
   * @param {String} resourceId
   * @returns {Promise}
   */
  readResource: function(resourceId) {
    const service = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      service.get('resourceAdapter').readResource(resourceId)
        .then(response => service.get('resourceSerializer').normalizeReadResource(response))
        .then(resolve, reject);
    });
  }
});
