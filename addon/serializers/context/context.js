import Ember from 'ember';
import ContextResult from 'quizzes-addon/models/result/context';
import QuestionResult from 'quizzes-addon/models/result/question';
import Context from 'quizzes-addon/models/context/context';

export default Ember.Object.extend({

  /**
   * Normalizes a ContextResult
   * @param {ContextResult} contextResult
   * @returns {*[]}
   */
  normalizeContextResult: function (payload) {
    const serializer = this;
    return ContextResult.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.contextId,
      currentResourceId: payload.currentResourceId,
      resourceResults: serializer.normalizeResourceResults(payload.events),
      collectionId: payload.collectionId
    });
  },

  /**
   * Serializes read assignment
   ** @param {*[]} payload
   */
  normalizeReadContext: function(payload) {
    const contextData = payload.contextData;
    const metadata = contextData ? contextData.metadata : {};
    return Context.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.contextId,
      title: metadata.title,
      description: metadata.description,
      classId: payload.classId,
      collectionId: payload.collectionId,
      isCollection: payload.isCollection,
      profileId: payload.profileId,
      hasStarted: payload.hasStarted
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
        answer: resourceResult.answer || null,
        score: resourceResult.score,
        skipped: resourceResult.isSkipped
      })
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
    serializedAssignment.hasStarted = assignment.get('hasStarted');
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
      timeSpent: resourceResult.get('timeSpentToSave')
    };
    if (resourceResult.get('isQuestion')) {
      serialized.answer = resourceResult.get('answer') ?
        resourceResult.get('answer').map(({ value }) => ({ value })) : null;
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
        contextMap: assignment.get('contextMapping'),
        metadata: {
          title: assignment.get('title'),
          description: assignment.get('description')
        }
      }
    };
  },

  /**
   * Serializes the context params for analytics
   * @param {String} source
   ** @return {*} payload
   */
  serializeEventContext: function(eventSource, pathId, collectionSubType) {
    return {
      collectionSubType,
      eventSource,
      pathId,
      timezone: moment.tz.guess()
    };
  }

});
