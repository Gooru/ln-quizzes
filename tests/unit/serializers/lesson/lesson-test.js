import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:lesson/lesson', 'Lesson | Serializer | lesson/lesson');

test('NormalizeQueryRecordResponse for single result', function (assert) {
  const serializer = this.subject();
  const payload = {
    'summary': {
      'collectionCount': 1,
      'assessmentCount': 1
    },
    'collectionType': 'lesson',
    'collectionId': 24413346,
    'parentGooruOid': 'first-unit-id',
    'itemSequence': 1,
    'type': 'lesson',
    'lastModifiedUserUid': 'ff90e7e2-7788-48fb-9ce2-7b6d7a828840',
    'title': 'Property name conventions',
    'sharing': 'private',
    'collectionItemId': '262c9b8f-c866-4ce7-89bc-45cc01e62e17',
    'lastModified': 1448917633000,
    'gooruOid': 'first-lesson-id',
    'user': {
      'username': 'perezedify',
      'gooruUId': 'ff90e7e2-7788-48fb-9ce2-7b6d7a828840',
      'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/ff90e7e2-7788-48fb-9ce2-7b6d7a828840.png'
    }
  };
  const response = serializer.normalizeQueryRecordResponse('any store', 'lesson/lesson', payload);
  const expected = {
    'data': {
      'id': 'first-lesson-id',
      'type': 'lesson/lesson',
      'attributes': {
        'title': 'Property name conventions',
        'collection': 24413346,
        'visibility': false
      }
    }
  };

  assert.deepEqual(response, expected, 'Wrong response');
});

test('NormalizeQueryRecordResponse for multiple results', function (assert) {
  const serializer = this.subject();
  const payload = [
    {
      'title': 'Property name conventions',
      'gooruOid': 'first-lesson-id',
      'collectionId': 24413346,
      'visibility': false
    },
    {
      'title': 'Method naming convention',
      'gooruOid': 'second-lesson-id',
      'collectionId': 24413350,
      'visibility': false
    },
    {
      'title': 'Class naming conventions',
      'gooruOid': 'third-lesson-id',
      'collectionId': 24413351,
      'visibility': false
    }
  ];
  const response = serializer.normalizeQueryRecordResponse('any store', 'lesson/lesson', payload);
  const expected = {
    'data': [
      {
        'id': 'first-lesson-id',
        'type': 'lesson/lesson',
        'attributes': {
          'title': 'Property name conventions',
          'collection': 24413346,
          'visibility': false
        }
      },
      {
        'id': 'second-lesson-id',
        'type': 'lesson/lesson',
        'attributes': {
          'title': 'Method naming convention',
          'collection': 24413350,
          'visibility': false
        }
      },
      {
        'id': 'third-lesson-id',
        'type': 'lesson/lesson',
        'attributes': {
          'title': 'Class naming conventions',
          'collection': 24413351,
          'visibility': false
        }
      }
    ]
  };

  assert.deepEqual(response, expected, 'Wrong response');
});
