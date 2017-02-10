import Ember from 'ember';
import ContextResult from 'quizzes/models/result/context';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';
import QuestionResult from 'quizzes/models/result/question';
import Context from 'quizzes/models/context/context';

export default Ember.Object.extend({

  /**
   * Normalizes a ContextResult
   * @param {ContextResult} contextResult
   * @returns {*[]}
   */
  normalizeContextResult: function (payload) {
    const serializer = this;
    return ContextResult.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.id,
      currentResourceId: payload.currentResourceId,
      resourceResults: serializer.normalizeResourceResults(payload.events),
      collectionId: payload.collection.id
    });
  },

  /**
   * Serializes read assignment
   ** @param {*[]} payload
   */
  normalizeReadContext: function(payload) {
    return Context.create({
      id: payload.contextId,
      title: payload.contextData.metadata.title,
      description: payload.contextData.metadata.description,
      classId: payload.classId,
      collectionId: payload.collectionId,
      isCollection: payload.isCollection,
      profileId: payload.profileId
    });
  },

  /**
   * Serializes read assignments
   ** @param {*[]} payload
   */
  normalizeReadContexts: function(payload) {
    payload = payload || [];
    return payload.map(assignment => this.normalizeReadContext(assignment));
  },

  /**
   * Normalizes list of resource results
   * @param {*[]} payload
   * @returns {ResourceResult[]}
   */
  normalizeResourceResults: function (payload) {
    const serializer = this;
    payload = payload || [];
    return payload.map(
      resourceResult => QuestionResult.create(Ember.getOwner(serializer).ownerInjection(), {
        resourceId: resourceResult.resourceId,
        savedTime: resourceResult.timeSpent,
        reaction: resourceResult.reaction,
        answer: resourceResult.answer.length ? resourceResult.answer : null,
        score: resourceResult.score,
        skipped: resourceResult.isSkipped
      })
    );
  },

  /**
   * Normalizes a ReportData
   * @returns {ReportData}
   */
  normalizeReportData: function (payload) {
    const serializer = this;
    return ReportData.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.contextId,
      collectionId: payload.collection.id,
      reportEvents: serializer.normalizeReportDataEvents(payload.profileEvents)
    });
  },

  /**
   * Normalizes a ReportDataEvent
   * @returns {ReportDataEvent}
   */
  normalizeReportDataEvent: function (reportEvent) {
    let summary = reportEvent.contextProfileSummary;
    let reportDataEvent = ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
      currentResourceId: reportEvent.currentResourceId,
      profileId: reportEvent.profileId,
      resourceResults: this.normalizeResourceResults(reportEvent.events),
      isAttemptFinished: reportEvent.isComplete
    });
    if (summary) {
      reportDataEvent.setProperties({
        totalAnswered: summary.totalAnswered,
        totalCorrect: summary.totalCorrect,
        averageReaction: summary.averageReaction,
        averageScore: summary.averageScore,
        totalTimeSpent: summary.totalTimeSpent
      });
    }
    return reportDataEvent;
  },

  /**
   * Normalizes report data events
   * @returns {ReportDataEvent[]}
   */
  normalizeReportDataEvents: function (payload) {
    const serializer = this;
    payload = payload || [];
    return payload.map(
      reportEvent => serializer.normalizeReportDataEvent(reportEvent)
    );
  },

  /**
   * Serializes an assignment
   * @param {Assignment} assignment
   ** @return {*[]} payload
   */
  serializeContext: function(assignment) {
    let serializedAssignment = this.serializeUpdateContext(assignment);
    serializedAssignment.collectionId = assignment.get('collectionId');
    serializedAssignment.classId = assignment.get('classId');
    serializedAssignment.isCollection = assignment.get('isCollection');
    return serializedAssignment;
  },

  /**
   * Serializes a ResourceResult
   * @param {ResourceResult} resourceResult
   * @returns {*}
   */
  serializeResourceResult: function (resourceResult) {
    let serialized = {
      reaction: resourceResult.get('reaction'),
      resourceId: resourceResult.get('resourceId'),
      timeSpent: resourceResult.get('timeSpent')
    };
    if (resourceResult.get('isQuestion')) {
      serialized.answer = resourceResult.get('answer') ?
        resourceResult.get('answer').map(answer => {
          return { value: answer.value };
        }) : Ember.A();
    }
    return serialized;
  },

  /**
   * Serializes an assignment to update
   * @param {Assignment} assignment
   ** @return {*[]} payload
   */
  serializeUpdateContext: function(assignment) {
    return {
      contextData: {
        metadata: {
          title: assignment.get('title'),
          description: assignment.get('description')
        }
      }
    };
  }

});
