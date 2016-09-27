import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService('service:api-sdk/course', 'Unit | Service | api-sdk/course', {
  needs: ['serializer:course/course', 'model:course/course', 'model:user/user', 'adapter:course/course']
});

test('findById', function (assert) {
  const service = this.subject();
  const response = {
    "summary": {"unitCount": 1},
    "collectionType": "course",
    "collectionId": 24292300,
    "parentGooruOid": "42e2316a-d72d-4aad-a2b4-d54ee676b12d",
    "itemSequence": 25,
    "type": "course",
    "lastModifiedUserUid": "780b6450-a034-4adc-97e2-c3057b10e6b5",
    "title": "Indian History",
    "sharing": "private",
    "collectionItemId": "41d38472-b347-430c-b2bb-133c1e568e9d",
    "lastModified": 1437990694000,
    "gooruOid": "ab925bd9-bb9d-497c-a604-03b43b9d13d6",
    "taxonomyCourse": [{"id": 28, "name": "Earth Science", "subjectId": 2}],
    "user": {
      "username": "profile",
      "gooruUId": "780b6450-a034-4adc-97e2-c3057b10e6b5",
      "profileImageUrl": "http://profile-qa.s3.amazonaws.com/780b6450-a034-4adc-97e2-c3057b10e6b5.png"
    }
  };
  const routes = function () {
      this.get('/gooruapi/rest/v1/course/the-course-id', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  var done = assert.async();
  Ember.run(function() {
    const promise = service.findById('the-course-id');
    promise.then(function (course) {
      assert.equal(course.get('id'), 'ab925bd9-bb9d-497c-a604-03b43b9d13d6', 'Wrong id');
      assert.equal(course.get('title'), 'Indian History', 'Wrong title');
      assert.equal(course.get('totalUnits'), 1, 'Wrong total units');
      assert.equal(course.get('imageUrl'), '/assets/gooru/profile.png', 'Wrong imageUrl value');
      assert.equal(course.get('isPublic'), false, 'Wrong isPublic value');
      assert.equal(course.get('subjects.length'), 1, 'Wrong subjects');
      assert.equal(course.get('remixedBy.length'), 1, 'Wrong remixedBy');
      done();
    });
  });
});

test('createCourse', function(assert) {
  const service = this.subject();
  let courseModel = Ember.Object.create();

  assert.expect(2);

  // There is not a Adapter stub in this case
  // Pretender was included because it is needed to simulate the response Headers including the Location value
  this.pretender.map(function() {
    this.post('/api/nucleus/v1/courses', function() {
      return [200, {'Content-Type': 'text/plain', 'Location': 'course-id'}, ''];
    }, false);
  });

  service.set('serializer', Ember.Object.create({
    serializeCreateCourse: function(courseObject) {
      assert.deepEqual(courseObject, courseModel, 'Wrong profile object');
      return {};
    }
  }));

  var done = assert.async();
  service.createCourse(courseModel)
    .then(function() {
      assert.equal(courseModel.get('id'), 'course-id', 'Wrong course id');
      done();
    });
});

test('deleteCourse', function(assert) {
  const expectedCourseId = 'course-id';
  const service = this.subject();

  assert.expect(1);
  service.set('adapter', Ember.Object.create({
    deleteCourse: function(courseId) {
      assert.equal(courseId, expectedCourseId, 'Wrong course id');
      return Ember.RSVP.resolve();
    }
  }));

  var done = assert.async();
  service.deleteCourse('course-id')
    .then(function() {
      done();
    });
});

test('copyCourse', function(assert) {
  const service = this.subject();

  assert.expect(1);

  // There is not a Adapter stub in this case
  // Pretender was included because it is needed to simulate the response Headers including the Location value
  this.pretender.map(function() {
    this.post('/api/nucleus/v1/copier/courses/course-id', function() {
      return [201, {'Content-Type': 'text/plain', 'Location': 'copy-course-id'}, ''];
    }, false);
  });

  var done = assert.async();
  service.copyCourse('course-id')
    .then(function(response) {
      assert.equal(response, 'copy-course-id', 'Wrong course id');
      done();
    });
});

test('reorderCourse', function(assert) {
  const service = this.subject();
  const expectedCourseId = 'course-id';

  assert.expect(4);

  service.set('serializer', Ember.Object.create({
    serializeReorderCourse: function(resourceIds) {
      assert.equal(resourceIds.length, 2, 'Wrong total resources');
      assert.equal(resourceIds[0], 'a', 'Wrong id at index 0');
      return 'fake-data';
    }
  }));
  service.set('adapter', Ember.Object.create({
    reorderCourse: function(courseId, data) {
      assert.equal(courseId, expectedCourseId, 'Wrong course id');
      assert.equal(data, 'fake-data', 'Wrong data parameter coming from serializer');
      return Ember.RSVP.resolve();
    }
  }));

  var done = assert.async();
  service.reorderCourse(expectedCourseId, ["a", "b"]).then(function() { done(); });
});

