import DS from 'ember-data';

/**
 * Unit model
 *
 * A unit belongs to a course, it could many lessons
 *
 * @typedef {Object} Unit
 */
export default DS.Model.extend({

  /**
   * @property {string} unit title
   */
  title: DS.attr('string'),

  /**
   * @property {string} unit visibility
   */
  visibility: DS.attr('boolean'),

  /**
   * Collection identifier, later could be mapped as a Collection relationship if necessary
   * @property {number} collection id
   */
  collection: DS.attr("number")

});
