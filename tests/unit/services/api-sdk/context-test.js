import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/context', 'Unit | Service | api-sdk/context', {

});

test('moveToResource', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const previousResult =  {
    id: 'result-id'
  };

  assert.expect(5);

  service.set('contextAdapter', Ember.Object.create({
    moveToResource: function(resourceId, contextId, previous) {
      assert.deepEqual(resourceId, expectedResourceId, 'The resource id should match');
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      assert.deepEqual(previous, previousResult, 'The previous result should match');
      return Ember.RSVP.resolve(previousResult);
    }
  }));

  service.set('contextSerializer', Ember.Object.create({
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


test('startContext', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const assessmentResult = {
    id: 'result-id'
  };

  assert.expect(3);

  service.set('contextAdapter', Ember.Object.create({
    sendStartContextEvent: function(contextId) {
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      return Ember.RSVP.resolve(assessmentResult);
    }
  }));

  service.set('contextSerializer', Ember.Object.create({
    normalizeAssessmentResult: function(response) {
      assert.deepEqual(response, assessmentResult, 'The assessment result should match');
      return assessmentResult;
    }
  }));

  var done = assert.async();
  service.startContext(expectedContextId)
    .then(function(result) {
      assert.deepEqual(result, assessmentResult, 'The result should match');
      done();
    });
});

test('endContext', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const assessmentResult = {
    id: 'result-id'
  };

  assert.expect(2);

  service.set('contextAdapter', Ember.Object.create({
    sendEndContextEvent: function(contextId) {
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      return Ember.RSVP.resolve(assessmentResult);
    }
  }));

  var done = assert.async();
  service.endContext(expectedContextId)
    .then(function(result) {
      assert.deepEqual(result, assessmentResult, 'The result should match');
      done();
    });
});
