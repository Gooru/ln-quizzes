import Ember from 'ember';
import AssessmentResult from 'quizzes/models/result/assessment';
import QuestionResult from 'quizzes/models/result/question';
import Context from 'quizzes/models/context/context';
import Profile from 'quizzes/models/profile/profile';
import Collection from 'quizzes/models/collection/collection';

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
      resourceResults: serializer.normalizeResourceResults(payload.attempt),
      collectionId: payload.collection.id
    });
    return assessmentResult;
  },
  /**
   * Normalizes assignees list
   * @param {*[]} payload
   * @returns {ResourceResult[]}
   */
  normalizeAssigneesList: function (payload) {
    payload = payload || [];
    return payload.map(assignee => Profile.create({
        id: assignee.id,
        firstName: assignee.firstName,
        lastName: assignee.lastName,
        username: assignee.username
      })
    );
  },
  /**
   * Serializes read assignment
   ** @param {*[]} payload
   */
  normalizeReadContext:function(payload){
    var serializedAssignment = Context.create({});
    var assignees;

    if(payload.assignees){
      assignees = this.normalizeAssigneesList(payload.assignees);
    }

    serializedAssignment.setProperties({
      assignees:assignees,
      id:payload.id,
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
        firstName:payload.owner.firstName,
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
  normalizeReadContexts:function(payload){
    return payload.map(this.normalizeReadContext);
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
   ** @return {*[]} payload
   */
  serializeContext:function(assignment){
    var serializedAssignment = this.serializeUpdateContext(assignment);
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
    }
    return serializedAssignment;
  },
  /**
   * Serializes an assignment to update
   * @param {Assignment} assignment
   ** @return {*[]} payload
   */
  serializeUpdateContext:function(assignment){
    var serializedAssignment;
    var assignees;
    if (assignment.assignees) {
      assignees = this.serializeAssigneesList(assignment.assignees);
    }
    serializedAssignment = {
      assignees:assignees,
      contextData: {
        metadata: {
          title: assignment.get('title'),
          description: assignment.get('description'),
          isActive: assignment.get('isActive'),
          dueDate: assignment.get('dueDate') || '',
          createdDate: assignment.get('createdDate') || '',
          modifiedDate:  assignment.get('modifiedDate') || '' ,
          learningObjective: assignment.get('learningObjective')
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
          firstName: profile.get('firstName'),
          lastName: profile.get('lastName'),
          username: profile.get('username')
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
      serialized.answer = resourceResult.get('answer') ?
        resourceResult.get('answer').map(function(answer) {
          return { value: answer.value };
        }) : Ember.A();
    }
    return serialized;
  }

});
