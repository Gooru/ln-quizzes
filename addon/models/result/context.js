import Ember from 'ember';
import QuestionResult from './question';
import ResourceResult from './resource';

/**
 * Model for a group of resources that were answered by a user during one attempt to complete an assessment.
 *
 * @typedef {Object} ContextResult
 *
 */
export default Ember.Object.extend({

  /**
   * @property {number} averageReaction sumarization of all reactions
   */
  averageReaction: 0,

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {string} collectionId
   */
  collectionId: null,

  /**
   * @property {Context} context
   */
  context: null,

  /**
   * @property {string} contextId
   */
  contextId: null,

  /**
   * @property {number} correctAnswers number of correct answers
   */
  correctAnswers: 0,

  /**
   * @property {number} correctPercentage percentage of correct answers
   */
  correctPercentage: 0,

  /**
   * @property {string} currentResourceId
   */
  currentResourceId: null,

  /**
   * @property {ResourceResult} currentResult
   */
  currentResource: Ember.computed('currentResult', function() {
    return this.get('currentResult.resource');
  }),

  /**
   * @property {ResourceResult} currentResult
   */
  currentResult: Ember.computed('currentResourceId', function() {
    return this.getResultByResourceId(this.get('currentResourceId'));
  }),

  /**
   * @property {boolean} isRealTime
   */
  isRealTime: false,

  /**
   * @property {QuestionResult[]} questionResults
   */
  questionResults: Ember.computed('resourceResults.@each.updated', function(){
    return this.get('resourceResults').filter(
      resourceResult => resourceResult instanceof QuestionResult);
  }),

  /**
   * @property {ResourceResult[]} resourceResults
   */
  resourceResults: Ember.A([]),

  /**
   * @property {QuestionResult[]} questionResults
   */
  sortedResourceResults: Ember.computed('resourceResults.@each.updated', function(){
    return this.get('resourceResults').sortBy('resource.sequence');
  }),

  /**
   * @property {boolean} showAttempts
   */
  showAttempts: false,

  /**
   * @property {boolean} submitted if the context has already been submitted
   */
  submitted: false,

  /**
   * @property {date} submittedAt Date of submission
   */
  submittedAt: 0,

  /**
   * @property {string} title - Title of the assessment
   */
  title: Ember.computed.alias('collection.title'),

  /**
   * @property {number} totalAttempts number of attempts made
   */
  totalAttempts: 0,

  /**
   * @property {number} totalResources
   */
  totalResources: Ember.computed.alias('resourceResults.length'),

  /**
   * @property {number} totalTimeSpent sum of all the time spent
   */
  totalTimeSpent: 0,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Gets the result by resource id
   * @param {string} resourceId
   * @returns {ResourceResult}
   */
  getResultByResourceId: function(resourceId) {
    return this.get('resourceResults').findBy('resourceId', resourceId);
  },

  /**
   * Initializes the assessment results
   * @param {Collection} collection
   */
  // TODO change may be needed when quizzes endpoint to retrieve resources is ready
  merge: function(collection) {
    this.set('collection', collection);
    const resourceResults = this.get('resourceResults');
    const resources = collection.get('resources');

    if (resources.get('length')) {

      resources.forEach(function (resource) {
        let resourceId = resource.get('id');
        let found = resourceResults.findBy('resourceId', resourceId);
        if (!found) {
          let result = (resource.get('isQuestion')) ?
            QuestionResult.create({ resourceId, resource }) :
            ResourceResult.create({ resourceId, resource });
          resourceResults.pushObject(result);
        } else {
          found.set('resource', resource);
        }
      });

      let currentResourceId = this.get('currentResourceId');
      if (!currentResourceId || resourceResults.findBy('id', currentResourceId)) {
        this.set('currentResourceId', resources[0].get('id'));
      }

    } else {
      Ember.Logger.error(`Collection with ID: ${collection.get('id')} does not have any resources. No resource results were set.`);
    }
  }

});
