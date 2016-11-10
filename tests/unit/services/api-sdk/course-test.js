import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/course', 'Unit | Service | api-sdk/course', {
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
