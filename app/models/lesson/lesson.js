import DS from 'ember-data';

/**
 * Lesson model
 *
 * A lesson belongs to a unit
 *
 * @typedef {Object} Lesson
 */
export default DS.Model.extend({

  /**
   * @property {string} lesson title
   */
  title: DS.attr('string'),

  /**
   * @property {string} lesson visibility
   */
  visibility: DS.attr('boolean'),

  /**
   * Collection identifier, later could be mapped as a Collection relationship if necessary
   * @property {number} collection id
   */
  collection: DS.attr("number")

});
