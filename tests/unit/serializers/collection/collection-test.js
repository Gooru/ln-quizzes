import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:collection/collection', 'Unit | Serializer | collection/collection');

test('normalizeReadCollection', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    title: 'collection-title',
    isCollection: true,
    resources: null
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.equal(collection.get('title'), 'collection-title', 'Wrong title');
  assert.ok(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(collection.get('resources').length, 0, 'Wrong size for resources');
});

test('normalizeReadCollection with resources', function(assert) {
  const serializer = this.subject();
  serializer.set('resourceSerializer.normalizeReadQuestion', resource => `${resource}-normalized`);
  const collectionData = {
    id: 'collection-id',
    title: 'collection-title',
    isCollection: false,
    resources: [
      'resource1',
      'resource2'
    ]
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.equal(collection.get('title'), 'collection-title', 'Wrong title');
  assert.notOk(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(collection.get('resources').length, 2, 'Wrong size for resources');
  assert.equal(collection.get('resources')[0], 'resource1-normalized', 'Wrong value for resource');
});
