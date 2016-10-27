import Ember from 'ember';
import AssessmentResult from 'quizzes/models/result/assessment';
import QuestionResult from 'quizzes/models/result/question';
import { getQuestionUtil } from 'quizzes/config/question';

export default Ember.Object.extend({

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
      let userAnswer = resourceResult.get('answer');
      serialized.answer = resourceResult.get('answer');
    }
    return serialized;
  },

  /**
   * Normalizes a AssessmentResult
   * @param {AssessmentResult} assessmentResult
   * @returns {*[]}
   */
  normalizeAssessmentResult: function (payload) {
    let serializer = this;
    const assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
      contextId: payload.contextId,
      currentResourceId: payload.currentResourceId,
      resourceResults: serializer.normalizeResourceResults(payload.collectionStatus)
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
        timeSpent: resourceResult.timeSpent,
        reaction: resourceResult.reaction,
        answer: resourceResult.answer,
        score: resourceResult.score
      });
    });
  }

});
