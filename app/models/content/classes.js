import Ember from 'ember';

/**
 * Classes model
 *
 * @typedef {Object} ClassesModel
 */
export default Ember.Object.extend({
  /**
   * @property {String[]} List of classes where the user is owner
   */
  ownerList: [],

  /**
   * @property {String[]} List of classes where the user is collaborator
   */
  collaboratorList: [],

  /**
   * @property {String[]} List of classes where the user is member
   */
  memberList: [],

  /**
   * @property {Object} List of key values containing class id and student count
   */
  memberCount: {},

  /**
   * @property {Class[]} Detailed list of classes
   */
  classes: []
});