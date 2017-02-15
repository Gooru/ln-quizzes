import Ember from 'ember';
import AttemptSerializer from 'quizzes/serializers/attempt/attempt';
import AttemptAdapter from 'quizzes/adapters/attempt/attempt';

export default Ember.Service.extend({

  init: function () {
    this._super(...arguments);
    this.set('attemptAdapter', AttemptAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('attemptSerializer', AttemptSerializer.create(Ember.getOwner(this).ownerInjection()));
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
   * Get data to show on the real time report
   * @param {String} contextId
   * @returns {Promise}
   */
  getReportData: function(contextId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('attemptAdapter').getReportData(contextId)
        .then(response => service.get('attemptSerializer').normalizeReportData(response))
        .then(resolve, reject);
    });
  }
});
