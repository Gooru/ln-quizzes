import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService('service:quizzes/api-sdk/resource', 'Unit | Service | quizzes/api-sdk/resource');

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
