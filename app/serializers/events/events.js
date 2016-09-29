import Ember from 'ember';
import {getQuestionUtil} from 'quizzes/config/question';
import {toTimestamp} from 'quizzes/utils/utils';
import Env from '../../config/environment';
const ConfigEvent = Env['events'] || {};
import TaxonomySerializer from 'quizzes/serializers/taxonomy/taxonomy';

export default Ember.Object.extend({

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('taxonomySerializer', TaxonomySerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Serializes a assessment result
   * @param {AssessmentResult} assessment
   * @param {Context} context
   * @param {string} apiKey
   * @returns {*[]}
   */
  serializeCollection: function (assessment, context, apiKey) {
    let serializer = this;
    let totalResources = assessment.get("totalResources");
    let contextObject = serializer.getContextValuesForCollection(context, totalResources);
    let startedAt = assessment.get('startedAt');
    let submittedAt = assessment.get('submittedAt');
    let startTime = toTimestamp(startedAt);
    let endTime = !submittedAt ? startTime: toTimestamp(submittedAt);

    return [{
      "eventId": context.get('parentEventId'),
      "eventName": "collection.play",
      "session": {
        "apiKey": apiKey,
        "sessionId": context.get('sessionId')
      },
      "startTime": startTime,
      "endTime": endTime,
      "user": {"gooruUId": context.get('userId')},
      "context": contextObject,
      "version": {"logApi": ConfigEvent.apiVersion},
      "metrics": {},
      "payLoadObject": { "gradingType": "System", "isStudent": context.get("isStudent") }
    }];
  },

  /**
   * Serializes a result
   * @param {ResourceResult} resourceResult
   * @param {Context} context
   * @param {string} apiKey
   * @returns {*[]}
   */
  serializeResource: function (resourceResult, context, apiKey) {
    let serializer = this;
    let resource = resourceResult.get("resource");
    let resourceType = resource.get("isQuestion") ? 'question' : 'resource';
    let reactionType = resourceResult.get('reaction');
    let contextObject = serializer.getContextValuesForResult(context, resource.get("id"), resourceType, reactionType);

    let startedAt = resourceResult.get('startedAt');
    let submittedAt = resourceResult.get('submittedAt');
    let startTime = toTimestamp(startedAt);
    let endTime = !submittedAt ? startTime: toTimestamp(submittedAt);
    let serialized = {
      "eventId": context.get('resourceEventId'),
      "eventName": "collection.resource.play",
      "session": {"apiKey": apiKey, "sessionId": context.get('sessionId')},
      "startTime": startTime,
      "endTime": endTime,
      "user": {"gooruUId": context.get('userId')},
      "context": contextObject,
      "version": {"logApi": ConfigEvent.apiVersion},
      "metrics": {}
    };

    if (resource.get("isQuestion")) {
      let question = resourceResult.get('question');
      let util = getQuestionUtil(question.get("questionType")).create({question: question});
      let userAnswer = resourceResult.get("userAnswer");
      serialized.payLoadObject = {
        "questionType": resourceResult.get('question.questionType'),
        "attemptStatus": (context.get("isStopEvent") ? resourceResult.get('attemptStatus') : undefined),
        "answerObject": util.toJSONAnswerObjects(userAnswer),
        "isStudent": context.get("isStudent"),
        "taxonomyIds": serializer.get('taxonomySerializer').serializeTaxonomyForEvents(resource.get('taxonomy'))
      };
    }
    else{
      serialized.payLoadObject = { //TODO looks for resource parameters
        "isStudent": context.get("isStudent"),
        "taxonomyIds": serializer.get('taxonomySerializer').serializeTaxonomyForEvents(resource.get('taxonomy'))
      };
    }
    return [serialized];
  },

  serializeReaction: function(resourceResult, context, apiKey) {
    let serializer = this;
    let resource = resourceResult.get('resource');
    let reactionType = resourceResult.get('reaction');  // Extracts the reaction value (reactionType) from the resourceResult
    let startTime = toTimestamp(resourceResult.get('startedAt'));
    let contextObject = serializer.getContextValuesForReaction(context, resource.get('id'), reactionType);
    let serialized = {
      eventId: context.get('resourceEventId'),
      eventName: 'reaction.create',
      session: { apiKey: apiKey, sessionId: context.get('sessionId') },
      user: { gooruUId: context.get('userId') },
      startTime: startTime,
      endTime: startTime,   // Setting the same startTime for the endTime
      context: contextObject,
      version: { logApi: ConfigEvent.apiVersion },
      metrics: {},
      payLoadObject: { isStudent: context.get("isStudent") }
    };
    return [serialized];
  },

  /**
   * Gets context values
   * @param {Context} context
   * @param {string} resourceType question|resource
   * @returns {*}
   */
  getContextValuesForResult: function (context, resourceId, resourceType, reactionType) {
    return {
      "contentGooruId": resourceId,
      "parentGooruId": context.get('collectionId'),
      "classGooruId": context.get('classId'),
      "parentEventId": context.get('parentEventId'),
      "type": context.get('eventType'),
      "courseGooruId": context.get('courseId'),
      "unitGooruId": context.get('unitId'),
      "lessonGooruId": context.get('lessonId'),
      "collectionType": context.get('collectionType'),
      "resourceType": resourceType,
      "clientSource": "web",
      reactionType: reactionType
    };
  },

  /**
   * Gets context values for collection
   * @param {Context} context
   * @param {number} questionCount
   * @returns {*}
   */
  getContextValuesForCollection: function (context, questionCount) {
    return {
      "type": context.get('eventType'),
      "contentGooruId": context.get('collectionId'),
      "classGooruId": context.get('classId'),
      "courseGooruId": context.get('courseId'),
      "unitGooruId": context.get('unitId'),
      "lessonGooruId": context.get('lessonId'),
      "collectionType": context.get('collectionType'),
      "questionCount": questionCount,
      "clientSource": "web"
    };
  },

  getContextValuesForReaction: function(context, resourceId, reactionType) {
    return {
      contentGooruId: resourceId,
      parentGooruId: context.get('collectionId'),
      classGooruId: context.get('classId'),
      parentEventId: context.get('parentEventId'),
      courseGooruId: context.get('courseId'),
      unitGooruId: context.get('unitId'),
      lessonGooruId: context.get('lessonId'),
      collectionType: context.get('collectionType'),
      reactionType: reactionType
    };
  }

});
