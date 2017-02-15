import Ember from 'ember';
import ContextResult from 'quizzes/models/result/context';
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
