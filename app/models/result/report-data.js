import Ember from 'ember';
import { CONTEXT_EVENT_TYPES } from 'quizzes/config/config';
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
   * Parse and add event data from web socket
   * @param {Object} eventData
   */
  parseEvent: function(eventData) {
    if (eventData.eventName === CONTEXT_EVENT_TYPES.START) {
      this.parseStartEvent(eventData);
    } else if (eventData.eventName === CONTEXT_EVENT_TYPES.FINISH) {
      this.parseFinishEvent(eventData);
    } else if(eventData.eventName === CONTEXT_EVENT_TYPES.ON_RESOURCE){
      this.parseOnResourceEvent(eventData);
    }
  },

  /**
   * Parse start event data from web socket
   * @param {Object} eventData
   */
  parseFinishEvent: function(eventData) {
    let oldReportEvents = this.findByProfileId(eventData.profileId);
    if (oldReportEvents.length) {
      oldReportEvents[0].setProfileSummary(eventData.eventBody.eventSummary, true);
    }
  },

  /**
   * Parse on resource event data from web socket
   * @param {Object} eventData
   */
  parseOnResourceEvent: function(eventData) {
    let oldReportEvents = this.findByProfileId(eventData.profileId);
    if (oldReportEvents.length) {
      let profileEvent = oldReportEvents[0];
      let previousResource = eventData.eventBody.previousResource;
      profileEvent.setProfileSummary(eventData.eventBody.eventSummary, false);
      profileEvent.set('currentResourceId', eventData.eventBody.currentResourceId);
      profileEvent.merge(previousResource.resourceId, previousResource);
    }
  },

  /**
   * Parse start event data from web socket
   * @param {Object} eventData
   */
  parseStartEvent: function(eventData) {
    let oldReportEvents = this.findByProfileId(eventData.profileId);
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
    if (oldReportEvents.length) {
      newProfileEvent.set('profileName', oldReportEvents[0].get('profileName'));
      if(eventData.eventBody.isNewAttempt) {
        // Replace the old student report
        this.replaceByProfileId(eventData.profileId, newProfileEvent);
      }
    } else {
      this.get('reportEvents').pushObject(newProfileEvent);
    }
  },

  /**
   * Replace an event using a profile id
   * @param {String} profileId
   * @param {Object} profileEvent
   */
  replaceByProfileId: function(profileId, profileEvent) {
    this.set('reportEvents', this.get('reportEvents').map(reportEvent =>
      reportEvent.get('profileId') === profileId ? profileEvent : reportEvent));
  }
});
