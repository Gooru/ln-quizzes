import Ember from 'ember';

import UserResourcesResult from 'quizzes/models/result/user-resources';
import ResourceResult from 'quizzes/models/result/resource';
import QuestionResult from 'quizzes/models/result/question';
import AnswerObject from 'quizzes/utils/question/answer-object';
import LearningTarget from 'quizzes/models/result/learning-target';
import { getQuestionUtil } from 'quizzes/config/question';
import { toLocal } from 'quizzes/utils/utils';

export default Ember.Object.extend({

  normalizeResponse: function(payload) {
    var realTimeModel = [];
    this.normalizeUserResults(realTimeModel, payload.content);
    return realTimeModel;
  },

  normalizeUserResults: function(model, payload) {
    const serializer = this;
    payload.forEach(function(userResult) {
      this.push(serializer.normalizeUserResult(userResult));
    }, model);
  },

  normalizeUserResult: function(payload) {
    const serializer = this;
    return UserResourcesResult.create({
      user: payload.userUId,
      isAttemptFinished: !!payload.isCompleteAttempt,   // This value is used only by the RealTime dashboard
      resourceResults: serializer.normalizeResourceResults(payload.usageData)
    });
  },

  normalizeResourceResults: function(payload) {
    const serializer = this;
    var resourceResults = [];
    payload.forEach(function (resourceResult) {
      this.push(serializer.normalizeResourceResult(resourceResult));
    }, resourceResults);
    return resourceResults;
  },

  normalizeResourceResult: function(payload) {
    let answerObjects = this.normalizeAnswerObjects(payload.answerObject);
    if (payload.resourceType && payload.resourceType === 'question') {
      let util = getQuestionUtil(payload.questionType).create();

      let startedAt = payload.startTime ? toLocal(payload.startTime) : toLocal(new Date().getTime());
      let submittedAt = payload.endTime ? toLocal(payload.endTime) : startedAt;

      let questionResult = QuestionResult.create({
        //Commons fields for real time and student collection performance
        resourceId: payload.gooruOId,
        reaction: payload.reaction,
        timeSpent: payload.timeSpent,
        userAnswer: util.toUserAnswer(answerObjects),

        //fields only for real time
        correct: payload.score > 0,

        //fields only for student collection performance
        score: payload.score,
        resourceType: payload.resourceType,
        attempts: payload.attempts,
        sessionId: payload.sessionId,
        startedAt: startedAt,
        submittedAt: submittedAt
      });
      questionResult.submittedAnswer = !!questionResult.userAnswer;
      return questionResult;
    } else {
      return ResourceResult.create({
        //Commons fields for real time and student collection performance
        resourceId: payload.gooruOId,
        reaction: payload.reaction,
        timeSpent: payload.timeSpent,

        //fields only for student collection performance
        score: payload.score,
        resourceType: payload.resourceType,
        attempts: payload.attempts,
        sessionId: payload.sessionId,
        startedAt: payload.startTime ? toLocal(payload.startTime) : toLocal(new Date().getTime()), /* TODO this should come from server */
        submittedAt: payload.endTime ? toLocal(payload.endTime) : null
      });
    }
  },

  /**
   * Answer object information
   * @see quizzes/utils/question/*
   *
   * @param {string|[]} answerObjects
   * @returns {AnswerObject[]}
   */
  normalizeAnswerObjects: function(answerObjects){
    answerObjects = (!answerObjects || answerObjects === 'N/A' ||  answerObjects === 'NA') ? [] : answerObjects;
    if (typeof answerObjects === 'string'){
      answerObjects = JSON.parse(answerObjects);
    }

    if (!Ember.$.isArray(answerObjects)){
      answerObjects = [];
    }
    return answerObjects.map(function(answerObject){
      return AnswerObject.create(answerObject);
    });
  },

  normalizeGetStandardsSummary: function(payload) {
    var result = [];
    const serializer = this;
    const content = payload.content;
    if (Ember.isArray(content)) {
      result = content.map(function(standard) {
        return LearningTarget.create({
          id: standard.standardsId ? standard.standardsId : standard.learningTargetsId,
          standard: standard.displayCode,
          mastery: standard.score,
          relatedQuestions: serializer.normalizeQuestions(standard.questions)
        });
      });
    }
    return result;
  },

  normalizeQuestions: function(payload) {
    var result = [];
    if (Ember.isArray(payload)) {
      result = payload.map(function(question) {
        return question.questionId;
      });
    }
    return result;
  }

});
