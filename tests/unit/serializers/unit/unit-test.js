import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:unit/unit', 'Unit | Serializer | unit/unit');

test('NormalizeQueryRecordResponse for single result', function (assert) {
  const serializer = this.subject();
  const payload = {
    'summary': {
      'lessonCount': 3
    },
    'collectionType': 'unit',
    'collectionId': 24413345,
    'parentGooruOid': '77836ac2-b462-43b3-a204-b86e44382b45',
    'itemSequence': 1,
    'type': 'unit',
    'lastModifiedUserUid': 'ff90e7e2-7788-48fb-9ce2-7b6d7a828840',
    'title': 'Code conventions',
    'sharing': 'private',
    'ideas': '',
    'collectionItemId': '49557e9b-3aae-4cda-ab7f-23f8c9b2bd31',
    'lastModified': 1448581167000,
    'questions': '',
    'gooruOid': 'first-unit-id',
    'taxonomyCourse': [
      {
        'id': 36,
        'name': 'Other',
        'subjectId': 2
      }
    ],
    'user': {
      'username': 'perezedify',
      'gooruUId': 'ff90e7e2-7788-48fb-9ce2-7b6d7a828840',
      'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/ff90e7e2-7788-48fb-9ce2-7b6d7a828840.png'
    }
  };
  const response = serializer.normalizeQueryRecordResponse('any store', 'unit/unit', payload);
  const expected = {
    'data': {
      'id': 'first-unit-id',
      'type': 'unit/unit',
      'attributes': {
        'title': 'Code conventions',
        'collection': 24413345,
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
      'title': 'Code conventions',
      'gooruOid': 'first-unit-id',
      'collectionId': 24413345,
      'visibility': false
    },
    {
      'title': 'Unit testing',
      'gooruOid': 'second-unit-id',
      'collectionId': 24413347,
      'visibility': false
    }
  ];
  const response = serializer.normalizeQueryRecordResponse('any store', 'unit/unit', payload);
  const expected = {
    'data': [
      {
        'id': 'first-unit-id',
        'type': 'unit/unit',
        'attributes': {
          'title': 'Code conventions',
          'collection': 24413345,
          'visibility': false
        }
      },
      {
        'id': 'second-unit-id',
        'type': 'unit/unit',
        'attributes': {
          'title': 'Unit testing',
          'collection': 24413347,
          'visibility': false
        }
      }
    ]
  };

  assert.deepEqual(response, expected, 'Wrong response');
});
