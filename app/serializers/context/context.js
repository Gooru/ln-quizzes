import Ember from 'ember';
import AssessmentResult from 'quizzes/models/result/assessment';
import QuestionResult from 'quizzes/models/result/question';

export default Ember.Object.extend({

  /**
   * Normalizes a AssessmentResult
   * @param {AssessmentResult} assessmentResult
   * @returns {*[]}
   */
  normalizeAssessmentResult: function (payload) {
    let serializer = this;
    const assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.id,
      currentResourceId: payload.currentResourceId,
      resourceResults: serializer.normalizeResourceResults(payload.collectionStatus),
      collectionId: payload.collection.id
    });
    return assessmentResult;
  },

  /**
   * Normalizes list of resource results
   * @param {*[]} payload
   * @returns {ResourceResult[]}
   */
  normalizeResourceResults: function (payload) {
    const serializer = this;
    payload = payload || [];
    return payload.map(function(resourceResult) {
      return QuestionResult.create(Ember.getOwner(serializer).ownerInjection(), {
        resourceId: resourceResult.resourceId,
        savedTime: resourceResult.timeSpent,
        reaction: resourceResult.reaction,
        answer: resourceResult.answer,
        score: resourceResult.score
      });
    });
  },
  /**
   * Serializes an assignment
   * @param {Assignment} assignment
   ** @param {*[]} payload
   */
  serializeContext:function(assignment){

    var serializedAssignment;
    var assignees = this.serializeAssigneesList(assignment.assignees);
    serializedAssignment = {
      assignees:assignees,
      contextData: {
        metadata: {
          title:		assignment.get('title'),
          description:	assignment.get('description'),
          isActive:	assignment.get('isActive'),
          dueDate:	assignment.get('dueDate'),
          createdDate:assignment.get('createdDate'),
          modifiedDate:assignment.get('modifiedDate'),
          attempts:assignment.get('attempts'),
          questions:assignment.get('questions'),
          learningObjective:assignment.get('learningObjective'),
          settings:assignment.get('settings')
        }
      }
    };
    return serializedAssignment;
  },
  /**
   * Serializes an assigneesList
   * @param {[Profile]} assigneesList
   ** @param {*[]} payload
   */
  serializeAssigneesList:function(assigneesList){
    var serializedAssigneesList = assigneesList.map(function (profile) {
      return {
          id:profile.get('id'),
          firstName:profile.get('firstName'),
          lastName:profile.get('lastName'),
          username:profile.get('username')
        };
    });
    return serializedAssigneesList;
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
      serialized.answer = resourceResult.get('answer').map(function(answer) {
        return { value: answer.value };
      });
    }
    return serialized;
  }

});
