import Ember from 'ember';
import EventsSerializer from 'quizzes/serializers/events/events';
import EventsAdapter from 'quizzes/adapters/events/events';

export default Ember.Service.extend({

  init: function () {
    this._super(...arguments);
    this.set('eventsAdapter', EventsAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('eventsSerializer', EventsSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {EventsAdapter} adapter
   */
  eventsAdapter: null,

  /**
   * @property {EventsSerializer} serializer
   */
  eventsSerializer: null,

  // -------------------------------------------------------------------------
  // Methods

  moveToResource: function(resourceId, contextId, previousResult) {
    var service = this;
    var serializedPreviousResult = previousResult ?
      this.get('eventsSerializer').serializeResourceResult(previousResult) :
      null;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('eventsAdapter').moveToResource(resourceId, contextId, serializedPreviousResult)
        .then(resolve, reject);
    });
  }
});
