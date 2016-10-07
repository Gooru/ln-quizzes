import Ember from 'ember';
import QuestionResult from './question';

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
   * @property {number} totalResources
   */
  totalResources: Ember.computed.alias("resourceResults.length"),

  /**
   * Gets the result by resource id
   * @param {string} resourceId
   * @returns {ResourceResult}
   */
  getResultByResourceId: function(resourceId){
    return this.get('resourceResults').findBy('resourceId', resourceId);
  }

});
