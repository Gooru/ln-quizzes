import Ember from 'ember';
import ProfileSerializer from 'quizzes/serializers/profile/profile';
import ProfileAdapter from 'quizzes/adapters/profile/profile';

export default Ember.Service.extend({

  init: function () {
    this._super(...arguments);
    this.set('profileAdapter', ProfileAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('profileSerializer', ProfileSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ProfileAdapter} adapter
   */
  profileAdapter: null,

  /**
   * @property {ProfileSerializer} serializer
   */
  profileSerializer: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Reads a profile by id
   * @param {String} profileId
   * @returns {Promise}
   */
  readProfile: function(profileId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').readProfile(profileId)
        .then(response => service.get('profileSerializer').normalizeProfile(response))
        .then(resolve, reject);
    });
  }
});
