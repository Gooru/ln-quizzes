import Ember from 'ember';
import Env from '../../config/environment';
const ConfigEvent = Env['events'] || {};

export default Ember.Service.extend({

  saveResourceResult: function(resourceResult, context) {
    var service = this;
    var apiKey = ConfigEvent.eventAPIKey;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const eventContent = service.get('eventsSerializer').serializeResource(resourceResult, context, apiKey);
      service.get('collectionResourceAdapter').postData({
        body: eventContent,
        query: {
          apiKey: apiKey
        }
      }).then(function() {
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  },

  saveCollectionResult: function(assessment, context) {
    const service = this;
    const apiKey = ConfigEvent.eventAPIKey;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const eventContent = service.get('eventsSerializer').serializeCollection(assessment, context, apiKey);
      service.get('collectionPlayAdapter').postData({
        body: eventContent,
        query: {
          apiKey: apiKey
        }
      }).then(function() {
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  },

  saveReaction: function(resourceResult, context) {
    var service = this;
    var apiKey = ConfigEvent.eventAPIKey;
    var reactionContent = service.get('eventsSerializer').serializeReaction(resourceResult, context, apiKey);
    return service.get('collectionResourceAdapter').postData({
      body: reactionContent,
      query: {
        apiKey: apiKey
      }
    });
  }

});
