import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';
import CollectionModel from 'quizzes/models/content/collection';

moduleForService('service:api-sdk/collection', 'Unit | Service | api-sdk/collection', {
  needs: ['serializer:collection/collection', 'model:collection/collection',
    'model:resource/resource', 'adapter:collection/collection']
});

test('readCollection', function(assert) {
  const service = this.subject();
  const expectedCollectionId = 'collection-id';
  assert.expect(2);

  service.set('collectionAdapter', Ember.Object.create({
    readCollection: function(collectionId) {
      assert.equal(collectionId, expectedCollectionId, 'Wrong Collection id');
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
  service.readCollection(expectedCollectionId).then(done);
});
