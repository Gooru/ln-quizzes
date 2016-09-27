import DS from 'ember-data';

/**
 * Model to represent the course's users location in a specific unit, lesson and collection (assessments or collections).
 */
export default DS.Model.extend({

  /**
   * @property {string} unit id
   */
  unit: DS.attr('string'),
  /**
   * @property {string} lesson id
   */
  lesson: DS.string('string'),
  /**
   * @property {string} collection id
   */
  collection: DS.string('string'),
  /**
   * @property {User[]} locationUsers list of users in the location
   */
  locationUsers: DS.hasMany('course/location-user')

});
