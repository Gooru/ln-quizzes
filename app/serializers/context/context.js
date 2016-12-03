import Ember from 'ember';
import ProfileSerializer from 'quizzes/serializers/profile/profile';
import ContextResult from 'quizzes/models/result/context';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';
import QuestionResult from 'quizzes/models/result/question';
import Context from 'quizzes/models/context/context';
import Profile from 'quizzes/models/profile/profile';
import Collection from 'quizzes/models/collection/collection';

export default Ember.Object.extend({

  /**
   * Normalizes assignees list
   * @param {*[]} payload
   * @returns {ResourceResult[]}
   */
  normalizeAssigneesList: function (payload) {
    payload = payload || [];
    return payload.map(ProfileSerializer.normalizeProfile);
  },

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
      resourceResults: serializer.normalizeResourceResults(payload.attempt),
      collectionId: payload.collection.id
    });
  },

  /**
   * Serializes read assignment
   ** @param {*[]} payload
   */
  normalizeReadContext: function(payload) {
    const serializer = this;
    let serializedAssignment = Context.create({
      assignees: payload.assignees ? serializer.normalizeAssigneesList(payload.assignees) : [],
      id: payload.id,
      title: payload.contextData.metadata.title,
      description: payload.contextData.metadata.description,
      isActive: payload.contextData.metadata.isActive,
      dueDate: payload.contextData.metadata.dueDate,
      createdDate: payload.contextData.metadata.createdDate,
      modifiedDate: payload.contextData.metadata.modifiedDate,
      learningObjective: payload.contextData.metadata.learningObjective,
      externalCollectionId: payload.externalCollectionId,
      owner: payload.owner ? Profile.create({
          id: payload.owner.id,
          firstName: payload.owner.firstName,
          lastName: payload.owner.lastName ,
          username: payload.owner.username
        }) : null,
      collection:Collection.create({
        id: payload.collection.id
      })
    });
    return serializedAssignment;
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
        answer: resourceResult.answer,
        score: resourceResult.score
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
      contextId: payload.id,
      collectionId: payload.collection.id,
      reportEvents: serializer.normalizeReportDataEvents(payload.profileEvents)
    });
  },

  /**
   * Normalizes a ReportDataEvent
   * @returns {ReportDataEvent}
   */
  normalizeReportDataEvent: function (reportEvent) {
    return ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
      currentResourceId: reportEvent.currentResourceId,
      profileId: reportEvent.profileId,
      resourceResults: this.normalizeResourceResults(reportEvent.events)
    });
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
   * Serializes an assigneesList
   * @param {[Profile]} assigneesList
   ** @param {*[]} payload
   */
  serializeAssigneesList: function(assigneesList) {
    let serializedAssigneesList = assigneesList.map(profile => {
      return {
        id: profile.get('id'),
        firstName: profile.get('firstName'),
        lastName: profile.get('lastName'),
        username: profile.get('username')
      };
    });
    return serializedAssigneesList;
  },

  /**
   * Serializes an assignment
   * @param {Assignment} assignment
   ** @return {*[]} payload
   */
  serializeContext: function(assignment) {
    let serializedAssignment = this.serializeUpdateContext(assignment);
    serializedAssignment.externalCollectionId = assignment.get('externalCollectionId');
    serializedAssignment.owner = assignment.get('owner') ? {
      firstName: assignment.get('owner.firstName'),
      id: assignment.get('owner.id'),
      lastName: assignment.get('owner.lastName'),
      username: assignment.get('owner.username')
    } : {
      firstName: '',
      id: '',
      lastName: '',
      username: ''
    };
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
    let serializedAssignment;
    const serializer = this;
    serializedAssignment = {
      assignees: assignment.get('assignees') ? serializer.serializeAssigneesList(assignment.get('assignees')): [],
      contextData: {
        metadata: {
          title: assignment.get('title'),
          description: assignment.get('description'),
          isActive: assignment.get('isActive'),
          dueDate: assignment.get('dueDate') || null,
          learningObjective: assignment.get('learningObjective')
        }
      }
    };
    return serializedAssignment;
  }

});
