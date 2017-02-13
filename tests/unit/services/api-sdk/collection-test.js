import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/collection', 'Unit | Service | api-sdk/collection', {
  needs: ['serializer:collection/collection', 'model:collection/collection',
    'model:resource/resource', 'adapter:collection/collection']
});

test('readCollection', function(assert) {
  const service = this.subject();
  const expectedCollectionId = 'collection-id';
  const expectedType = 'collection';
  assert.expect(3);

  service.set('collectionAdapter', Ember.Object.create({
    readCollection: function(collectionId,type) {
      assert.equal(collectionId, expectedCollectionId, 'Wrong Collection id');
      assert.equal(type, expectedType, 'Wrong Collection type');
      return Ember.RSVP.resolve({ id: collectionId });
    }
  }));

  service.set('collectionSerializer', Ember.Object.create({
    normalizeReadCollection: function(collectionData) {
      assert.deepEqual(collectionData, { id: expectedCollectionId }, 'Wrong Collection data');
      return {};
    }
  }));

  var done = assert.async();
  service.readCollection(expectedCollectionId,expectedType).then(done);
});
