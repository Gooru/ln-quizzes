import Ember from 'ember';
import ContextSerializer from 'quizzes/serializers/context/context';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';

export default Ember.Object.extend({

  /**
   * @property {ContextSerializer} contextSerializer
   */
  contextSerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('contextSerializer', ContextSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Normalizes a ReportData
   * @returns {ReportData}
   */
  normalizeReportData: function (payload) {
    const serializer = this;
    return ReportData.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.contextId,
      collectionId: payload.collectionId,
      reportEvents: serializer.normalizeReportDataEvents(payload.profileAttempts)
    });
  },

  /**
   * Normalizes a ReportDataEvent
   * @returns {ReportDataEvent}
   */
  normalizeReportDataEvent: function (reportEvent) {
    let summary = reportEvent.eventSummary;
    let reportDataEvent = ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
      currentResourceId: reportEvent.currentResourceId,
      profileId: reportEvent.profileId,
      resourceResults: this.get('contextSerializer').normalizeResourceResults(reportEvent.events),
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
  }
});
