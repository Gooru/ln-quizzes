import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/events', 'Unit | Service | api-sdk/events', {

});

test('moveToResource', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const previousResult =  {
    id: 'result-id'
  };

  assert.expect(5);

  service.set('eventsAdapter', Ember.Object.create({
    moveToResource: function(resourceId, contextId, previous) {
      assert.deepEqual(resourceId, expectedResourceId, 'The resource id should match');
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      assert.deepEqual(previous, previousResult, 'The previous result should match');
      return Ember.RSVP.resolve(previousResult);
    }
  }));

  service.set('eventsSerializer', Ember.Object.create({
    serializeResourceResult: function(result) {
      assert.deepEqual(result, previousResult, 'The resource result should match');
      return previousResult;
    }
  }));

  var done = assert.async();
  service.moveToResource(expectedResourceId, expectedContextId, previousResult)
    .then(function(result) {
      assert.deepEqual(result, previousResult, 'The result should match');
      done();
    });
});
