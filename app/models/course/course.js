import DS from 'ember-data';

/**
 * Model to represent the course's data
 */
export default DS.Model.extend({

  /**
   * @property {Number} category - Category the course belongs to
   */
  category: DS.attr('number'),

  /**
   * @property {string} title
   */
  title: DS.attr('string'),

  /**
   * Count of total units assign to the course
   * @property {number} totalUnits
   */
  totalUnits: DS.attr("number"),

  /**
   * @property {String[]} Array with the subjects
   */
  subjects: DS.attr(),

  /**
   * @property {string} Course image url
   */
  imageUrl: DS.attr('string'),

  /**
   * @property {Boolean} Indicates if the course is public
   */
  isPublic: DS.attr('boolean'),

  /**
   * @property {Array} List of users who have remixed the course
   */
  remixedBy: DS.hasMany('user/user')

});
