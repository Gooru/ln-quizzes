import Ember from 'ember';
import DS from 'ember-data';
import StoreMixin from '../../mixins/store';

export default Ember.Service.extend(StoreMixin, {

  /**
   * Returns the current user course location.
   * @param user the user id
   * @returns {Location}
   */
  findOneByUser: function(user) {
    const users = Ember.A([this.createUserObjectWithId(user, 1, true)]);
    const response = Ember.Object.create({
      unit: 'second-unit-id',
      lesson: '27f0bc24-c2b5-40d8-bb8f-e6ec939ad553',
      collection: '567399f336d4a8e75eb10661',
      locationUsers: DS.PromiseArray.create({
        promise: Ember.RSVP.resolve(users)
      })
    });

    return DS.PromiseObject.create({
      promise: new Ember.RSVP.resolve(response)
    });
  },

  /**
   * Returns all the locations for a specific course.
   * @param course the course id
   * @returns {Location[]}
   */
  findByCourse: function(course, options={}) {
    const service = this;
    var response = Ember.A([]);

    Ember.$.each(options.units, function(index, unit) {
      response.push(service.createUnitObject(unit.id, index));
    });

    return DS.PromiseArray.create({
      promise: Ember.RSVP.resolve(response)
    });
  },

  /**
   * Returns all the locations for a specific course and unit.
   * @param course the course id
   * @param unit the unit id
   * @returns {Location[]}
   */
  findByCourseAndUnit: function(course, unit, options={}) {
    const service = this;
    var response = Ember.A([]);

    Ember.$.each(options.lessons, function(index, lesson) {
      response.push(service.createLessonObject(unit, lesson.id, index));
    });

    return DS.PromiseArray.create({
      promise: Ember.RSVP.resolve(response)
    });
  },

  /**
   * Returns all the locations for a specific course, unit and lesson.
   * @param course the course id
   * @param unit the unit id
   * @param lesson the lesson id
   * @returns {UserLocation[]}
   */
  findByCourseAndUnitAndLesson: function(course, unit, lesson, options={}) {
    const service = this;
    var response = Ember.A([]);

    Ember.$.each(options.collections, function(index, collection) {
      response.push(service.createCollectionObject(unit, lesson, collection.id, index));
    });

    return DS.PromiseArray.create({
      promise: Ember.RSVP.resolve(response)
    });
  },

  // TODO: remove this method that is only a temporal helper
  createStudents: function(index) {
    const service = this;
    var totalUsers = 0;

    if (index === 1) {
      totalUsers = 2;
    } else if (index === 2) {
      totalUsers = 3;
    } else if (index === 3) {
      totalUsers = 10;
    } else if (index === 4) {
      totalUsers = 30;
    } else {
      totalUsers = 1;
    }

    var students = Ember.A();
    for (var i = 1; i <= totalUsers; i++) {
      students.push(service.createUserObject(i, true));
    }

    return DS.PromiseArray.create({
      promise: new Ember.RSVP.resolve(students)
    });
  },

  createUserObjectWithId: function(id, index, isActive) {
    return  Ember.Object.create({
      isActive: isActive,
      user: Ember.Object.create({
        id: id,
        firstName: 'firstname-' + index,
        lastName: 'lastname-' + index,
        fullName: 'lastname-' + index + ', firstname-' + index,
        email: 'user_' + index + '@test.com',
        username: 'username-' + index,
        avatarUrl: '/assets/gooru/profile.png'
      })
    });
  },

  createUserObject: function(index, isActive) {
    return this.createUserObjectWithId('id-' + index, index, isActive);
  },

  createUnitObject: function(unit, index) {
    return Ember.Object.create({
      unit: unit,
      locationUsers: this.createStudents(index)
    });
  },

  createLessonObject: function(unit, lesson, index) {
    return Ember.Object.create({
      unit: unit,
      lesson: lesson,
      locationUsers: this.createStudents(index)
    });
  },

  createCollectionObject: function(unit, lesson, collection, index) {
    return Ember.Object.create({
      unit: unit,
      lesson: lesson,
      collection: collection,
      locationUsers: this.createStudents(index)
    });
  }

});
