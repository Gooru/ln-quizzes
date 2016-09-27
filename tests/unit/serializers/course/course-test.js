import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:course/course', 'Unit | Serializer | course/course');

test('normalizeFindRecordResponse', function(assert) {
  const serializer = this.subject();

  const payload = {
    'summary': {'unitCount': 1},
    'collectionType': 'course',
    'collectionId': 24292300,
    'parentGooruOid': '42e2316a-d72d-4aad-a2b4-d54ee676b12d',
    'itemSequence': 25,
    'type': 'course',
    'lastModifiedUserUid': '780b6450-a034-4adc-97e2-c3057b10e6b5',
    'title': 'Indian History',
    'sharing': 'private',
    'collectionItemId': '41d38472-b347-430c-b2bb-133c1e568e9d',
    'lastModified': 1437990694000,
    'gooruOid': 'ab925bd9-bb9d-497c-a604-03b43b9d13d6',
    'taxonomyCourse': [{'id': 28, 'name': 'Earth Science', 'subjectId': 2}],
    'user': {
      'username': 'profile',
      'gooruUId': '780b6450-a034-4adc-97e2-c3057b10e6b5',
      'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/780b6450-a034-4adc-97e2-c3057b10e6b5.png'
    }
  };
  const expected = {
    'data': {
      'id': 'ab925bd9-bb9d-497c-a604-03b43b9d13d6',
      'type': 'course/course',
      'attributes': {
        'title': 'Indian History',
        'subjects': ['Earth Science'],
        'imageUrl': '/assets/gooru/profile.png',
        'totalUnits': 1,
        'isPublic': false
      },
      'relationships': {
        'remixedBy': {
          'data': [
            {
              'id': '780b6450-a034-4adc-97e2-c3057b10e6b5',
              'type': 'user/user'
            }
          ]
        }
      }
    },
    'included': [
      {
        'id': '780b6450-a034-4adc-97e2-c3057b10e6b5',
        'type': 'user/user',
        'attributes': {
          'username': 'profile',
          'profileImageUrl': 'http://profile-qa.s3.amazonaws.com/780b6450-a034-4adc-97e2-c3057b10e6b5.png'
        }
      }
    ]
  };
  const response = serializer.normalizeFindRecordResponse('any store', 'course/course', payload);

  assert.deepEqual(response, expected, 'Wrong response');
});

