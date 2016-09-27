import Ember from 'ember';


export default Ember.Controller.extend({

  // -------------------------------------------------------------------------
  // Attributes

  queryParams: ['token', 'classId','page'],
  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {String} Token to authenticate
   */
  token:null,

  /**
   * @property {String} Class ID when required
   */
  classId:null,

  /**
   * @property {String} TokenID
   */
  page:null

});
