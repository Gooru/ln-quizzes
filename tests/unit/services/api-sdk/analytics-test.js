import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService('service:api-sdk/analytics', 'Unit | Service | api-sdk/analytics', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('findResourcesByCollection', function(assert) {
  const service = this.subject();
  const response = {
    'content':[
      {
        'userUId':'602fee94-50cf-4a8b-af2b-6b73e0319bab',
        'usageData':[
          {
            'gooruOId': '46d4a6d4-991b-4c51-a656-f694e037dd68',
            'views': 1,
            'score': 1,
            'reaction': 5,
            'timeSpent': 3600000,
            'resourceType': 'question',
            'questionType': 'MC',
            'answerObject': 'NA'
          }
        ]
      }
    ],
    'message': null,
    'paginate': null
  };

  assert.expect(2);

  service.set('analyticsAdapter', Ember.Object.create({
    queryRecord: function(query) {
      assert.deepEqual(query, {
        classId: 'the-class-id',
        courseId: 'the-course-id',
        unitId: 'the-unit-id',
        lessonId: 'the-lesson-id',
        collectionId: 'the-collection-id',
        collectionType: 'the-collection-type'
      });
      return Ember.RSVP.resolve(response);
    }
  }));

  service.set('analyticsSerializer', Ember.Object.create({
    normalizeResponse: function(payload) {
      assert.deepEqual(payload, response);
      return [];
    }
  }));

  var done = assert.async();
  service.findResourcesByCollection('the-class-id', 'the-course-id', 'the-unit-id', 'the-lesson-id', 'the-collection-id', 'the-collection-type')
    .then(function() {
      done();
    });
});

