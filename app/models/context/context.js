import Ember from 'ember';

/**
 * Context model
 * typedef {Object} Context
 */
const Context = Ember.Object.extend( {

  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {string} title
   */
  title: null,


  /**
   * @property {string}
   */
  description: '',

  /**
   * @property {}
   */
  standards: [],
  /**
  * @property {boolean}
  */
  isActive:false,

  /**
   * @property {number}
   */
  createdDate:null,

  /**
   * @property {number}
   */
  modifiedDate:null,
  /**
   * @property {number}
   */
  dueDate:null,
  /**
   * @property {[]}
   */
  attempts:[],
  /**
   * @property {number}
   */
  totalAttempts:Ember.computed.alias('attempts.length'),
  /**
   * @property {[Profile]}
   */
  assignees:[],
  /**
   * @property {number}
   */
  totalStudents:Ember.computed.alias('assignees.length'),
  /**
   * @property {[]}
   */
  questions:[],
  /**
   * @property {Object}
   */
  settings:null

});

export default Context;
