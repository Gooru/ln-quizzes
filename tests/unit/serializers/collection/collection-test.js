import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:collection/collection', 'Unit | Serializer | collection/collection');

test('normalizeReadCollection', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: true,
    resources: null
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.ok(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(collection.get('resources').length, 0, 'Wrong size for resources');
});

test('normalizeReadCollection with resources', function(assert) {
  const serializer = this.subject();
  serializer.set('resourceSerializer', {
    normalizeReadResource: resource => `${resource}-normalized`
  });
  const collectionData = {
    id: 'collection-id',
    isCollection: false,
    resources: [
      'resource1',
      'resource2'
    ]
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.notOk(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(collection.get('resources').length, 2, 'Wrong size for resources');
  assert.equal(collection.get('resources')[0], 'resource1-normalized', 'Wrong value for resource');
});

test('normalizeReadCollection with settings', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      setting: {
        show_key:'never'
      }
    }
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('showKey'),false, 'Should be false');

  const collectionData2 = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      setting: {
        show_key:'summary'
      }
    }
  };

  const collection2 = serializer.normalizeReadCollection(collectionData2);
  assert.equal(collection2.get('showKey'),true, 'Should be true');
});
