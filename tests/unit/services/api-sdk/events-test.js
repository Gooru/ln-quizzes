import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';
import Env from 'gooru-web/config/environment';

const ConfigEvent = Env['events'] || {};

moduleForService('service:api-sdk/events', 'Unit | Service | api-sdk/events', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('saveReaction', function(assert) {
  const service = this.subject();
  const resourceResultObj = {};
  const contextObj = {};
  const reactionContentObj = {};
  const apiKeyConfigValue = ConfigEvent.eventAPIKey;

  assert.expect(4);

  service.set('collectionResourceAdapter', Ember.Object.create({
    postData: function(data) {
      assert.deepEqual({
        body: reactionContentObj,
        query: {
          apiKey: apiKeyConfigValue
        }
      }, data);
      return Ember.RSVP.resolve();
    }
  }));

  service.set('eventsSerializer', Ember.Object.create({
    serializeReaction: function(resourceResult, context, apiKey) {
      assert.deepEqual(resourceResultObj, resourceResult);
      assert.deepEqual(contextObj, context);
      assert.deepEqual(apiKeyConfigValue, apiKey);
      return reactionContentObj;
    }
  }));

  var done = assert.async();
  service.saveReaction(resourceResultObj, contextObj)
    .then(function() {
      done();
    });
});

