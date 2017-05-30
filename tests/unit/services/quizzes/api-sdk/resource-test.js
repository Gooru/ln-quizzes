import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService('service:quizzes/api-sdk/resource', 'Unit | Service | quizzes/api-sdk/resource');

test('sendFinishResource', function(assert) {
  assert.expect(10);
  const service = this.subject();
  const expectedData = 'data';
  const expectedContext = 'context';
  const expectedResult = 'result';
  const expectedPathId = 'path-id';
  const expectedSource = 'source';
  const expectedCUL = 'cul';
  const resourceId = 'resource-id';
  service.set('resourceAdapter', Ember.Object.create({
    sendFinishResource: function(id, data, context) {
      assert.equal(id, resourceId, 'Wrong adapter resource id');
      assert.equal(data, expectedData, 'Wrong adapter event data');
      assert.equal(context, expectedContext, 'Wrong adapter event context');
      return Ember.RSVP.resolve({});
    }
  }));
  service.set('contextSerializer', Ember.Object.create({
    serializeResourceResult: (result, withResourceId) => {
      assert.equal(result, expectedResult, 'Resource result should match');
      assert.notOk(withResourceId, 'Expected to be false');
      return expectedData;
    },
    serializeEventContext: (source, pathId, subtype, cul) => {
      assert.equal(source, expectedSource, 'Source should match');
      assert.equal(pathId, expectedPathId, 'Path id should match');
      assert.notOk(subtype, 'Subtype should match');
      assert.equal(cul, expectedCUL, 'CUL object should match');
      return expectedContext;
    }
  }));

  let done = assert.async();
  service.sendFinishResource(resourceId, expectedResult, expectedPathId, expectedSource, expectedCUL)
    .then(response => {
      assert.deepEqual(response, {}, 'Wrong response');
      done();
    });
});

test('readResource', function(assert) {
  assert.expect(3);
  const service = this.subject();
  let expectedData = 'data';
  const resourceId = 'resource-id';
  service.set('resourceAdapter', Ember.Object.create({
    readResource: function(data) {
      assert.deepEqual(data, resourceId, 'Wrong adapter resource id');
      return Ember.RSVP.resolve({});
    }
  }));
  service.set('resourceSerializer', Ember.Object.create({
    normalizeReadResource: function(resource) {
      assert.ok(resource, 'Wrong resource object');
      return expectedData;
    }
  }));

  let done = assert.async();
  service.readResource(resourceId).then(response => {
    assert.deepEqual(response, expectedData, 'Wrong response');
    done();
  });
});
