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
   * @property {ReportEvent[]} reportEvents
   */
  reportEvents: Ember.A(),

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
  students: Ember.computed('reportEvents', function () {
    return this.get('reportEvents').map(
      student => Ember.Object.create({
        id: student.get('profileId'),
        code: student.get('profileCode'),
        fullName: student.get('profileName')
      })
    );
  }),

  /**
   * @property {string[]} studentIds - List of student ids
   */
  studentIds: Ember.computed('students', function () {
    return this.get('students').map(student => student.get('id'));
  })

  // -------------------------------------------------------------------------
  // Methods
});
