import Ember from "ember";
import QuestionResult from './question';
import ResourceResult from './resource';

import { averageReaction, correctPercentage, totalTimeSpent, correctAnswers } from 'gooru-web/utils/question-result';

/**
 * Model for a group of questions that were answered by a user during one attempt to complete an assessment.
 *
 * @typedef {Object} AssessmentResult
 *
 */
export default Ember.Object.extend({


  //
  // Properties
  /**
   * @property {ResourceResult[]} resourceResults
   */
  resourceResults: Ember.A([]),

  /**
   * @property {string} sessionId
   */
  sessionId: null,

  /**
   * The owner collection
   * @property {Collection}
   */
  collection: null,

  /**
   * @property {QuestionResult[]} questionResults
   */
  questionResults: Ember.computed("resourceResults.[]", function(){
    return this.get("resourceResults").filter(function(resourceResult){
      return resourceResult instanceof QuestionResult;
    });
  }),

  /**
   * @property {QuestionResult[]} questionResults
   */
  sortedResourceResults: Ember.computed("resourceResults.[]", function(){
    return this.get("resourceResults").sortBy("resource.order");
  }),

  /**
   * TODO: TBD
   * @property {Object[]} mastery - An array of learning target objects
   * Each object should have the following properties:
   *
   * standard: DS.attr('string'),       // standard text
   * learningTarget: DS.attr('string'), // learning target text
   * relatedQuestions: DS.attr()        // array of question result ids; these correspond to the ids in questionResults
   * suggestedResources: DS.attr()      // array of resource cards
   */
  mastery: [],

  /**
   * Indicates if it has mastery
   * @property {boolean} hasMastery
   */
  hasMastery: Ember.computed.bool("mastery.length"),

  /**
   * @property {Date} submittedAt - Date in which the attempt was submitted
   */
  submittedAt: null,

  /**
   * @property {Date} startedAt - Date in which the attempt was started
   */
  startedAt: null,

  /**
   * @property {string} title - Title of the assessment
   */
  title: Ember.computed.alias("collection.title"),

  /**
   * @property {number} totalAttempts - Number of attempts the user has made for this assessment
   */
  totalAttempts: 0,

  /**
   * @property {number}
   */
  totalResources: Ember.computed.alias("resourceResults.length"),

  /**
   * @property {boolean} submitted
   */
  submitted: false,

  /**
   * @property {boolean} started
   */
  started: Ember.computed.bool("startedAt"),

  /**
   * Returns the last visited resource
   * @property {Resource} lastVisitedResource
   */
  lastVisitedResource: function() {
    const resourceResults = this.get("sortedResourceResults");
    let result = resourceResults
      .filterBy("started", true)
      .get("lastObject");
    return result ? result.get("resource") : resourceResults.get("firstObject").get("resource");
  }.property(),



  // -------------------------------------------------------------------------
  // Computed Properties

  /**
   * Average user reaction to the questions in the assessment
   * @prop {number} averageReaction
   */
  averageReaction: Ember.computed('resourceResults.[]',function(){
      return averageReaction(this.get('resourceResults'));
  }),

  /**
   * Percentage of correct answers vs. the total number of questions
   * @prop {number}
   */
  correctPercentage:Ember.computed('questionResults.[]',function(){
    return correctPercentage(this.get('questionResults'), true);
  }),

  /**
   * Total number of seconds spent completing the current attempt
   * @prop {number}
   */
  totalTimeSpent:Ember.computed('resourceResults.[]',function(){
    return totalTimeSpent(this.get('resourceResults'));
  }),

  /**
   * Total correct answers
   * @prop {number}
   */
  correctAnswers:Ember.computed('questionResults.[]',function(){
    return correctAnswers(this.get('questionResults'));
  }),

  /**
   * Returns pending question results, those started results but not submitted
   * @return {QuestionResult[]}
   */
  pendingQuestionResults: Ember.computed('questionResults.[]',function(){
    let questionResults = this.get("questionResults");
    return questionResults.filterBy("pending", true);
  }),


  //
  // Methods
  /**
   * Initializes the assessment results
   * @param {Collection} collection
   */
  merge: function(collection){
    this.set("collection", collection);
    const resourceResults = this.get("resourceResults");
    const resources = collection.get("resources");

    if (resources.get('length')) {

      resources.forEach(function (resource) {
        let resourceId = resource.get('id');
        let found = resourceResults.findBy("resourceId", resourceId);
        if (!found) {
          let result = (resource.get("isQuestion")) ?
            QuestionResult.create({resourceId: resourceId, resource: resource}) :
            ResourceResult.create({resourceId: resourceId, resource: resource});
          resourceResults.pushObject(result);
        }
        else {
          found.set("resource", resource);
        }
      });

    } else {
      Ember.Logger.error('Collection with ID: ' + collection.get('id') + ' does not have any resources. No resource results were set.');
    }


  },

  /**
   * Gets the result by resource id
   * @param {string} resourceId
   * @returns {ResourceResult}
   */
  getResultByResourceId: function(resourceId){
    return this.get("resourceResults").findBy("resourceId", resourceId);
  }



});
