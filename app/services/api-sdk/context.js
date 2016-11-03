import Ember from 'ember';
import ContextSerializer from 'quizzes/serializers/context/context';
import ContextAdapter from 'quizzes/adapters/context/context';

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

  startContext: function(contextId) {
    var service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').sendStartContextEvent(contextId)
        .then(service.get('contextSerializer').normalizeAssessmentResult)
        .then(resolve, reject);
    });
  },

  endContext: function(contextId) {
    var service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('contextAdapter').sendEndContextEvent(contextId)
        .then(resolve, reject);
    });
  }
});
