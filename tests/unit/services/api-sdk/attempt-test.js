import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/attempt', 'Unit | Service | api-sdk/attempt');

test('getReportData', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedContextId = 'context-id';
  const contextResult = {
    id: 'result-id'
  };

  service.set('attemptAdapter', Ember.Object.create({
    getReportData: function(contextId) {
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      return Ember.RSVP.resolve(contextResult);
    }
  }));

  service.set('attemptSerializer', Ember.Object.create({
    normalizeReportData: function(response) {
      assert.deepEqual(response, contextResult, 'The context result should match');
      return contextResult;
    }
  }));

  let done = assert.async();
  service.getReportData(expectedContextId)
    .then(function(result) {
      assert.deepEqual(result, contextResult, 'The result should match');
      done();
    });
});
