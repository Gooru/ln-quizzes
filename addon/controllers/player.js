import Ember from "ember";

export default Ember.Controller.extend({


  // -------------------------------------------------------------------------
  // Attributes

  queryParams: ['resourceId'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} resourceId
   */
  resourceId: null
});
