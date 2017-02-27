import Ember from 'ember';

/**
 * @typedef {Object} Collection
 */

export default Ember.Object.extend({

  /**
   * @property {[]}
   */
  attempts:[],

  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {boolean} hasResources
   */
  hasResources: Ember.computed.bool('resources.length'),

  /**
   * @property {boolean} Return true if the collection is an assessment
   */
  isAssessment: Ember.computed.not('isCollection'),

  /**
   * @property {boolean} Returns true if the collection type is collection
   */
  isCollection: null,

  /**
   * @property {[]}
   */
  questions: [],

  /**
   * @property {number} Total of resources in the collection
   */
  resourceCount: Ember.computed.readOnly('resources.length'),

  /**
   * @property {Array} List of resources associated to the collection
   */
  resources: Ember.A(),

  /**
   * @property {Array} List of resources associated to the collection
   */
  resourcesSorted: Ember.computed('resources', function() {
    let resources = this.get('resources');
    return resources.sortBy('sequence');
  }),

  /**
   * @property {Object}
   */
  settings: null,

  /**
   * @property {string} Collection's title
   */
  title: null,

  /**
   * @property {number}
   */
  totalAttempts: Ember.computed.alias('attempts.length'),

  /**
   * @property {boolean} Indicate if show answer key setting
   */
  showKey: Ember.computed.alias('settings.showKey'),

  /**
   * Gets the next resource based on the resource provided
   * @param {Resource} resource
   * @returns {Resource|undefined} next resource
   */
  nextResource: function(resource){
    var next;
    if (this.get('hasResources')){
      const resources = this.get('resources'),
        index = resources.indexOf(resource);
      next = resources.objectAt(index + 1);
    }
    return next;
  },

  /**
   * Gets the previous resource based on the resource provided
   * @param {Resource} resource
   * @returns {Resource|undefined} previous resource
   */
  prevResource: function(resource){
    var next;
    if (this.get('hasResources')){
      const resources = this.get('resources'),
        index = resources.indexOf(resource);
      next = resources.objectAt(index - 1);
    }
    return next;
  },

  /**
   * Gets the resource by id
   * @param {string }resourceId
   * @returns {Resource|undefined}
   */
  getResourceById: function(resourceId){
    var resource;
    if (this.get('hasResources')){
      const resources = this.get('resources').filterBy('id', resourceId);
      if (resources.get('length')){
        resource = resources.get('firstObject');
      }
    }
    return resource;
  },

  /**
   * Returns true if it's the last resource of the collection
   * @param {Resource}resource
   * @returns {Resource|undefined}
   */
  isLastResource: function(resource) {
    const resources = this.get('resources');
    var index = resources.indexOf(resource);
    var collectionLength = this.get('resourceCount');
    return ((index + 1) === collectionLength);
  }

});
