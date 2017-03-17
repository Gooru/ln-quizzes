import Ember from "ember";

export default Ember.Controller.extend({


  // -------------------------------------------------------------------------
  // Attributes

  queryParams: ['resourceId', 'sourceId'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} resourceId
   */
  resourceId: null,

  /**
   * @property {Collection} collection
   */
  collection: Ember.computed.alias('contextResult.collection'),

  /**
   * @property {ContextResult} contextResult
   */
  contextResult: null
});
