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
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Find an event by a profile id
   * @returns {ReportDataEvent[]}
   */
  findByProfileId: function(profileId) {
    return this.get('reportEvents').filter(reportEvent => reportEvent.get('profileId') === profileId);
  },

  /**
   * Find all results for the question id
   * @param {string} questionId
   * @returns {QuestionResult[]}
   */
  getResultsByQuestion: function(questionId) {
    return this.get('reportEvents').map(
      reportEvent => reportEvent.get('resourceResults').find(
        result => result.get('resourceId') === questionId)
    ).filter(result => result);
  },

  /**
   * Find all results for the profile id
   * @param {string} questionId
   * @returns {QuestionResult[]}
   */
  getResultsByStudent: function(profileId) {
    let profileEvents = this.findByProfileId(profileId);
    return profileEvents.length ? profileEvents[0].get('resourceResults') : [];
  },

  /**
   * Find all results by answer
   * @param {string} questionId
   * @param {Answer} answer
   * @returns {QuestionResult[]}
   */
  getStudentsByQuestionAndAnswer: function(question, answer) {
    return this.get('reportEvents').filter(function(reportEvent) {
      let questionResult = reportEvent.get('resourceResults').find(
        result => result.get('resourceId') === question.get('id'));
      return questionResult ? questionResult.get('answer.firstObject.value') === answer[0].value : false;
    }).map(student => Ember.Object.create({
      id: student.get('profileId'),
      code: student.get('profileCode'),
      fullName: student.get('profileName')
    }));
  },

  /**
   * Merge a new event into the report data
   * @param {ReportDataEvent} newReportEvent new event to merge
   */
  mergeEvent: function(newReportEvent) {
    let oldReportEvents = this.findByProfileId(newReportEvent.get('profileId'));
    let oldReportEvent = oldReportEvents.length ? oldReportEvents[0] : null;
    let newResults = newReportEvent.get('resourceResults');
    let newResult = newResults ? newResults[0] : null;
    if(newResult) {
      if(oldReportEvent) {
        oldReportEvent.merge(newResult.get('resourceId'), newResult);
      } else {
        this.get('reportEvents').push(newReportEvent);
      }
    }
  }
});
