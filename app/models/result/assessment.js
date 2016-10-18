import Ember from 'ember';
import QuestionResult from './question';
import ResourceResult from './resource';

/**
 * Model for a group of resources that were answered by a user during one attempt to complete an assessment.
 *
 * @typedef {Object} AssessmentResult
 *
 */
export default Ember.Object.extend({

  /**
   * @property {string} contextId
   */
  contextId: null,

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
   * @property {QuestionResult[]} questionResults
   */
  questionResults: Ember.computed('resourceResults.[]', function(){
    return this.get('resourceResults').filter(function(resourceResult){
      return resourceResult instanceof QuestionResult;
    });
  }),

  /**
   * @property {ResourceResult[]} resourceResults
   */
  resourceResults: Ember.A([]),

  /**
   * @property {QuestionResult[]} questionResults
   */
  sortedResourceResults: Ember.computed('resourceResults.[]', function(){
    return this.get('resourceResults').sortBy('resource.order');
  }),

  /**
   * @property {boolean} submitted if the assessment has already been submitted
   */
  submitted: false,

  /**
   * @property {number} totalResources
   */
  totalResources: Ember.computed.alias('resourceResults.length'),

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

      if (!this.get('currentResourceId')) {
        this.set('currentResourceId', resources[0].get('id'));
      }

    } else {
      Ember.Logger.error(`Collection with ID: ${collection.get('id')} does not have any resources. No resource results were set.`);
    }


  }

});
