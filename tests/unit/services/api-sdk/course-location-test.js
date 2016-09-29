import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/course-location', 'Unit | Service | api-sdk/course-location', {
  // This will be enabled when the code is complete
  //needs: ['serializer:course/location', 'model:course/location', 'adapter:course/location']
});


test('findOneByUser', function (assert) {
  const service = this.subject();
  var done = assert.async();
  Ember.run(function() {
    const promise = service.findOneByUser('id-1');
    promise.then(function(courseLocation) {
      assert.equal(courseLocation.get('unit'), 'second-unit-id', 'Wrong unit');
      assert.equal(courseLocation.get('lesson'), '27f0bc24-c2b5-40d8-bb8f-e6ec939ad553', 'Wrong lesson');
      assert.equal(courseLocation.get('collection'), '567399f336d4a8e75eb10661', 'Wrong collection');
      assert.equal(courseLocation.get('locationUsers.length'), 1, 'Missing users');
      const locationUser = courseLocation.get('locationUsers.firstObject');
      assert.equal(locationUser.get('isActive'), true, 'Wrong active status');
      assert.equal(locationUser.get('user.id'), 'id-1', 'Wrong user id');
      assert.equal(locationUser.get('user.firstName'), 'firstname-1', 'Wrong user firstName');
      assert.equal(locationUser.get('user.lastName'), 'lastname-1', 'Wrong user lastName');
      assert.equal(locationUser.get('user.email'), 'user_1@test.com', 'Wrong user email');
      assert.equal(locationUser.get('user.username'), 'username-1', 'Wrong user username');
      done();
    });
  });
});

test('findByCourse', function (assert) {
  const service = this.subject();
  var done = assert.async();
  Ember.run(function() {
    const promise = service.findByCourse('the-course-id', {
      units: [
        {id: 'unit-1'},
        {id: 'unit-2'},
        {id: 'unit-3'}
      ]
    });
    promise.then(function(courseLocations) {
      assert.equal(courseLocations.get('length'), 3, 'Missing course locations');
      const courseLocation = courseLocations.get('firstObject');
      assert.equal(courseLocation.get('unit'), 'unit-1', 'Wrong unit');
      assert.equal(courseLocation.get('locationUsers.length'), 1, 'Missing users');
      const locationUser = courseLocation.get('locationUsers.firstObject');
      assert.equal(locationUser.get('isActive'), true, 'Wrong active status');
      assert.equal(locationUser.get('user.id'), 'id-1', 'Wrong user id');
      assert.equal(locationUser.get('user.firstName'), 'firstname-1', 'Wrong user firstName');
      assert.equal(locationUser.get('user.lastName'), 'lastname-1', 'Wrong user lastName');
      assert.equal(locationUser.get('user.email'), 'user_1@test.com', 'Wrong user email');
      assert.equal(locationUser.get('user.username'), 'username-1', 'Wrong user username');
      done();
    });
  });
});

test('findByCourseAndUnit', function (assert) {
  const service = this.subject();
  var done = assert.async();
  Ember.run(function() {
    const promise = service.findByCourseAndUnit('the-course-id', 'unit-1', {
      lessons: [
        {id: 'lesson-1'},
        {id: 'lesson-2'},
        {id: 'lesson-3'},
        {id: 'lesson-4'},
        {id: 'lesson-5'}
      ]
    });
    promise.then(function(courseLocations) {
      assert.equal(courseLocations.get('length'), 5, 'Missing course locations');
      const courseLocation = courseLocations.get('firstObject');
      assert.equal(courseLocation.get('unit'), 'unit-1', 'Wrong unit');
      assert.equal(courseLocation.get('lesson'), 'lesson-1', 'Wrong lesson');
      assert.equal(courseLocation.get('locationUsers.length'), 1, 'Missing users');
      const locationUser = courseLocation.get('locationUsers.firstObject');
      assert.equal(locationUser.get('isActive'), true, 'Wrong active status');
      assert.equal(locationUser.get('user.id'), 'id-1', 'Wrong user id');
      assert.equal(locationUser.get('user.firstName'), 'firstname-1', 'Wrong user firstName');
      assert.equal(locationUser.get('user.lastName'), 'lastname-1', 'Wrong user lastName');
      assert.equal(locationUser.get('user.email'), 'user_1@test.com', 'Wrong user email');
      assert.equal(locationUser.get('user.username'), 'username-1', 'Wrong user username');
      const courseLocationLast = courseLocations.get('lastObject');
      assert.equal(courseLocationLast.get('unit'), 'unit-1', 'Wrong unit');
      assert.equal(courseLocationLast.get('lesson'), 'lesson-5', 'Wrong lesson');
      assert.equal(courseLocationLast.get('locationUsers.length'), 30, 'Missing users');
      const locationUserLast = courseLocationLast.get('locationUsers.lastObject');
      assert.equal(locationUserLast.get('isActive'), true, 'Wrong active status');
      assert.equal(locationUserLast.get('user.id'), 'id-30', 'Wrong user id');
      assert.equal(locationUserLast.get('user.firstName'), 'firstname-30', 'Wrong user firstName');
      assert.equal(locationUserLast.get('user.lastName'), 'lastname-30', 'Wrong user lastName');
      assert.equal(locationUserLast.get('user.email'), 'user_30@test.com', 'Wrong user email');
      assert.equal(locationUserLast.get('user.username'), 'username-30', 'Wrong user username');
      done();
    });
  });
});

test('findByCourseAndUnitAndLesson', function (assert) {
  const service = this.subject();
  var done = assert.async();
  Ember.run(function() {
    const promise = service.findByCourseAndUnitAndLesson('the-course-id', 'unit-1', 'lesson-1', {
      collections: [
        {id: 'collection-1'},
        {id: 'collection-2'},
        {id: 'collection-3'},
        {id: 'collection-4'}
      ]
    });
    promise.then(function(courseLocations) {
      assert.equal(courseLocations.get('length'), 4, 'Missing course locations');
      const courseLocation = courseLocations.get('firstObject');
      assert.equal(courseLocation.get('unit'), 'unit-1', 'Wrong unit');
      assert.equal(courseLocation.get('lesson'), 'lesson-1', 'Wrong lesson');
      assert.equal(courseLocation.get('collection'), 'collection-1', 'Wrong collection');
      assert.equal(courseLocation.get('locationUsers.length'), 1, 'Missing users');
      const locationUser = courseLocation.get('locationUsers.firstObject');
      assert.equal(locationUser.get('isActive'), true, 'Wrong active status');
      assert.equal(locationUser.get('user.id'), 'id-1', 'Wrong user id');
      assert.equal(locationUser.get('user.firstName'), 'firstname-1', 'Wrong user firstName');
      assert.equal(locationUser.get('user.lastName'), 'lastname-1', 'Wrong user lastName');
      assert.equal(locationUser.get('user.email'), 'user_1@test.com', 'Wrong user email');
      assert.equal(locationUser.get('user.username'), 'username-1', 'Wrong user username');
      const courseLocationLast = courseLocations.get('lastObject');
      assert.equal(courseLocationLast.get('unit'), 'unit-1', 'Wrong unit');
      assert.equal(courseLocationLast.get('lesson'), 'lesson-1', 'Wrong lesson');
      assert.equal(courseLocationLast.get('collection'), 'collection-4', 'Wrong collection');
      assert.equal(courseLocationLast.get('locationUsers.length'), 10, 'Missing users');
      const locationUserLast = courseLocationLast.get('locationUsers.lastObject');
      assert.equal(locationUserLast.get('isActive'), true, 'Wrong active status');
      assert.equal(locationUserLast.get('user.id'), 'id-10', 'Wrong user id');
      assert.equal(locationUserLast.get('user.firstName'), 'firstname-10', 'Wrong user firstName');
      assert.equal(locationUserLast.get('user.lastName'), 'lastname-10', 'Wrong user lastName');
      assert.equal(locationUserLast.get('user.email'), 'user_10@test.com', 'Wrong user email');
      assert.equal(locationUserLast.get('user.username'), 'username-10', 'Wrong user username');
      done();
    });
  });
});

