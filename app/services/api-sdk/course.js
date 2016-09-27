import Ember from 'ember';
import StoreMixin from '../../mixins/store';
import CourseSerializer from 'gooru-web/serializers/content/course';
import CourseAdapter from 'gooru-web/adapters/content/course';


/**
 * Service to support the Course CRUD operations
 *
 * @typedef {Object} CourseService
 */
export default Ember.Service.extend(StoreMixin, {

  serializer: null,

  adapter: null,


  init: function () {
    this._super(...arguments);
    this.set('serializer', CourseSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('adapter', CourseAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Creates a new course
   *
   * @param courseModel The Course model to be saved
   * @returns {Promise}
   */
  createCourse: function (courseModel) {
    var courseData = this.get('serializer').serializeCreateCourse(courseModel);

    return this.get('adapter').createCourse({
      body: courseData
    }).then(function (courseId) {
      courseModel.set('id', courseId);
      return courseModel;
    }).catch(function (error) {
      return error;
    });
  },

  /**
   * Returns a course by id
   * @param {string} id
   * @returns {Promise.<Course>}
   */
  findById: function(id) {
    return this.get('store').findRecord('course/course', id);
  },

  /**
   * Returns a course by id
   * @param {string} courseId
   * @returns {Promise|Content/Course}
   */
  fetchById: function (courseId) {
    return this.get('adapter').getCourseById(courseId)
      .then(function (courseData) {
        return this.get('serializer').normalizeCourse(courseData);
      }.bind(this))
      .catch(function (error) {
        return error;
      });
  },

  /**
   * Update existing course
   *
   * @param courseModel The Course model to update
   * @returns {Promise|Content/Course} Course model updated
   */
  updateCourse: function (courseModel, updateAll = true) {
    var courseData = this.get('serializer').serializeUpdateCourse(courseModel,updateAll);
    return this.get('adapter').updateCourse({
      courseId: courseModel.get('id'),
      course: courseData
    }).then(function () {
      return courseModel;
    }).catch(function (error) {
      return error;
    });
  },

  /**
   * Delete course
   *
   * @param courseId The Course id to delete
   * @returns {Ember.RSVP.Promise}
   */
  deleteCourse: function (courseId) {
    const service = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      service.get('adapter').deleteCourse(courseId)
        .then(resolve, reject);
    });
  },

  /**
   * Copies a course by id
   * @param {string} courseId
   * @returns {Ember.RSVP.Promise}
   */
  copyCourse: function(courseId){
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('adapter').copyCourse(courseId)
        .then(function(responseData, textStatus, request) {
          resolve(request.getResponseHeader('location'));
        }, reject );
    });
  },

  /**
   * Reorder course units
   *
   * @param courseId the id of the Course to be updated
   * @param {string[]} unitIds
   * @returns {Promise}
   */
  reorderCourse: function(courseId, unitIds) {
    const service = this;
    let serializedData = service.get('serializer').serializeReorderCourse(unitIds);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('adapter').reorderCourse(courseId, serializedData).then(resolve, reject);
    });
  }


});
