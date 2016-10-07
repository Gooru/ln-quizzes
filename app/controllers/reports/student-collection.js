import Ember from "ember";
import { toLocal } from 'quizzes/utils/utils';
import { ASSESSMENT_SHOW_VALUES } from "quizzes/config/config";

/**
 *
 * Controls the access to the analytics data for a
 * student related to a collection of resources
 *
 */

export default Ember.Controller.extend({

  queryParams: ["classId", "courseId", "unitId", "lessonId", "collectionId", "userId", "type", "role"],
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Ember.Service} Service to retrieve an assessment result
   */
  performanceService: Ember.inject.service("api-sdk/performance"),

  /**
   * @property {Ember.Service} Service to retrieve analytics data
   */
  analyticsService: Ember.inject.service("api-sdk/analytics"),

  /**
   * @property {Ember.Service} Service to get the Taxonomy data
   */
  taxonomyService: Ember.inject.service("api-sdk/taxonomy"),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    selectAttempt: function(attempt){
      const session = this.get("completedSessions")[attempt-1];
      this.loadSession(session);
    }
  },

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean} areAnswersHidden - Should answer results be hidden?
   */
  areAnswersHidden: Ember.computed('collection.isAssessment', 'collection.showFeedback', function() {
    return (this.get('collection.isAssessment') && this.get('collection.showFeedback') === ASSESSMENT_SHOW_VALUES.NEVER);
  }),

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: Ember.computed('collection.isAssessment', 'collection.showKey', function() {
    return (this.get('collection.isAssessment') && !this.get('collection.showKey'));
  }),

  /**
   * @property {Collection}
   */
  collection: null,

  /**
   * @property {AssessmentResult}
   */
  assessmentResult: null,

  /**
   * @property {UserSession[]}
   */
  completedSessions: [],

  /**
   * @property {Context}
   */
  context: null,

  /**
   * @property {Lesson}
   */
  lesson: null,

  /**
   * @property {string} indicates if it is collection or assessment
   */
  type: null,

  /**
   * @property {string} indicates if it is a student or teacher view
   */
  role: null,

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal("role", "student"),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not("isStudent"),

  /**
   * indicates if it is assessment type
   * @property {boolean}
   */
  isAssessment: Ember.computed.equal("type", "assessment"),

  /**
   * indicates if it is collection type
   * @property {boolean}
   */
  isCollection: Ember.computed.not("isAssessment"),


  /**
   * Indicates which is the url to go back when pressing the button
   * this is usefull when comming from the player out of the context of a class
   * this needs to be improved so it works when refreshing the page
   * @property {string}
   */
  backUrl: null,

  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods
  loadSession: function (session) {
    const controller = this;
    const context = controller.get("context");
    if (session){ //collections has no session
      context.set("sessionId", session.sessionId);
    }
    controller.get("performanceService")
      .findAssessmentResultByCollectionAndStudent(context)
      .then(function(assessmentResult) {
        assessmentResult.merge(controller.get("collection"));
        assessmentResult.set("totalAttempts", controller.get("completedSessions.length")); //TODO this is coming wrong from BE
        if (session && session.eventTime){
          assessmentResult.set("submittedAt", toLocal(session.eventTime));
        }

        if (session && context.get("isInContext")) {
          controller.get('analyticsService')
            .getStandardsSummary(context.get('sessionId'))
            .then(function (standardsSummary) {
              assessmentResult.set('mastery', standardsSummary);
              let standardsIds = standardsSummary.map(function (standardSummary) {
                return standardSummary.get('id');
              });
              if (standardsIds.length){ //if it has standards
                controller.get('taxonomyService')
                  .fetchCodesByIds(standardsIds)
                  .then(function (taxonomyStandards) {
                    standardsSummary.forEach(function (standardSummary) {
                      const taxonomyStandard = taxonomyStandards.findBy('id', standardSummary.get('id'));
                      if (taxonomyStandard) {
                        standardSummary.set('description', taxonomyStandard.title);
                      }
                    });
                  });
              }
            });
        }
        controller.set("assessmentResult", assessmentResult);
    });
  },

  resetValues: function () {
    this.set("assessmentResult", null);
    this.set("completedSessions", []);
    this.set("context", null);
    this.set("lesson", null);
    this.set("type", undefined);
    this.set("classId", undefined);
    this.set("courseId", undefined);
    this.set("unitId", undefined);
    this.set("lessonId", undefined);
    this.set("collectionId", undefined);
    this.set("userId", undefined);
    this.set("role", undefined);
  }

});
