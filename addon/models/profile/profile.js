import Ember from 'ember';

/**
 * Profile model with the user information
 *
 * @typedef {Object} ProfileModel
 */
export default Ember.Object.extend({

  /**
   * @property {string} email - The profile email
   */
  email: null,

  /**
   * @property {string} firstName - The user first name
   */
  firstName: null,

  /**
   * @property {string} fullName - The user full name
   */
  fullName: Ember.computed('firstName', 'lastName', function() {
    const firstName = this.get('firstName');
    const lastName = this.get('lastName');
    return `${firstName} ${lastName}`.trim();
  }),

  /**
   * @property {string} id - The profile id
   */
  id: null,

  /**
   * @property {boolean} isAssigned
   */
  isAssigned: null,

  /**
   * @property {string} lastName - The user last name
   */
  lastName: null,

  /**
   * @property {string} username - The user username
   */
  username: null

});