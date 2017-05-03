import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:collection/collection', 'Unit | Serializer | collection/collection');

test('normalizeReadCollection', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: true,
    resources: null,
    ownerId:'1234'
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.ok(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(collection.get('resources').length, 0, 'Wrong size for resources');
  assert.equal(collection.get('ownerId'), '1234', 'Wrong ownerId');
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

test('normalizeReadCollection with settings and title', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      title: 'collection-title',
      setting: {
        show_key:'never'
      }
    }
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('showKey'), false, 'Should be false');
  assert.equal(collection.get('title'), 'collection-title', 'Should be false');

  const collectionData2 = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      setting: {
        show_key: 'summary',
        attempts_allowed: -1,
        bidirectional_play: true,
        show_feedback: 'never'
      }
    }
  };

  const collection2 = serializer.normalizeReadCollection(collectionData2);
  assert.equal(collection2.get('showKey'), true, 'Should be true');
  assert.equal(collection2.get('attempts'), -1, 'Incorrect attempts');
  assert.equal(collection2.get('bidirectional'), true, 'Bidirectional should be true');
  assert.equal(collection2.get('showFeedback'), 'never', 'showFeedback should be never');
});
