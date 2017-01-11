import Ember from 'ember';
import ReportDataEvent from 'quizzes/models/result/report-data-event';
import QuestionResult from 'quizzes/models/result/question';

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
  students: Ember.computed('reportEvents.@each.profileId', function () {
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
  studentIds: Ember.computed('students.@each.id', function () {
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
  },

  /**
   * Parse and add event data from web socket
   * @param {Object} eventData
   */
  parseEvent: function(eventData) {
    if (eventData.eventName === 'startContextEvent') {
      this.parseStartEvent(eventData);
    }
  },

  /**
   * Parse start event data from web socket
   * @param {Object} eventData
   */
  parseStartEvent: function(eventData) {
    let oldReportEvents = this.findByProfileId(eventData.profileId);
    if (oldReportEvents.length) {
      if(eventData.eventBody.isNewAttempt) {
        let profileEvent = oldReportEvents[0];
        profileEvent.set('currentResourceId', eventData.eventBody.currentResourceId);
        profileEvent.get('resourceResults').forEach(result => result.clear());
      }
    } else {
      let newProfileEvent = ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
        currentResourceId: eventData.eventBody.currentResourceId,
        profileId: eventData.profileId,
        profileName: eventData.profileName,
        resourceResults: this.get('collection.resources').map(res =>
          QuestionResult.create(Ember.getOwner(this).ownerInjection(), {
            resourceId: res.id,
            resource: res,
            savedTime: 0,
            reaction: 0,
            answer: null,
            score: 0
          })
        )
      });
      this.get('reportEvents').pushObject(newProfileEvent);
    }
  }
});
