import Ember from 'ember';

/**
 * Report data model for context/assigment report
 *
 * @typedef {Object} ReportData
 *
 */
export default Ember.Object.extend({

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {string} collectionId
   */
  collectionId: null,

  /**
   * @property {string} contextId
   */
  contextId: null,

  /**
   * @property {TeacherContextEvent[]} contextEvents
   */
  contextEvents: Ember.A(),

  /**
   * @property {string[]} studentIds - List of student ids
   */
  resourceIds: Ember.computed('collection.resources', function () {
    return this.get('collection.resources').map(function (resource) {
      return resource.get('id');
    });
  }),

  /**
   * @property {string[]} studentIds - List of student ids
   */
  studentIds: Ember.computed('contextEvents', function () {
    return this.get('contextEvents').map(function (student) {
      return student.get('profileId');
    });
  })

  // -------------------------------------------------------------------------
  // Methods

});
