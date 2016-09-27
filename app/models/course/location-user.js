import DS from 'ember-data';

/**
 * Model to represent the current location user status
 */
export default DS.Model.extend({

  /**
   * @property {string} isActive
   */
  isActive: DS.attr('boolean'),
  /**
   * @property {User} user
   */
  user: DS.belongsTo('user/user')

});
