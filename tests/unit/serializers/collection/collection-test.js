import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:collection/collection', 'Unit | Serializer | collection/collection');

test('normalizeReadCollection', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    title: 'collection-title',
    isCollection: true
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.equal(collection.get('title'), 'collection-title', 'Wrong title');
  assert.ok(collection.get('isCollection'), 'Wrong value for isCollection');
});
