import Ember from 'ember';

/**
 * Current Location model
 * typedef {Object} CurrectLocation
 */
const CurrentLocation = Ember.Object.extend({

  /**
   * @property {String} classId - The current class ID
   */
  classId: null,

  /**
   * @property {String} courseId - The current course ID
   */
  courseId: null,

  /**
   * @property {String} unitId - The current unit ID
   */
  unitId: null,

  /**
   * @property {String} lessonId - The current lesson ID
   */
  lessonId: null,

  /**
   * @property {String} collectionId - The current collection ID
   */
  collectionId: null

});

export default CurrentLocation;
