import Ember from 'ember';
import CurrentLocationModel from 'gooru-web/models/analytics/current-location';

/**
 * CurrentLocation's Serializer
 *
 * @typedef {Object} CurrentLocationSerializer
 */
export default Ember.Object.extend({

  /**
   * Normalize the response from CurrentLocation endpoint
   * @param payload is the endpoint response in JSON format
   * @returns {CurrentLocation} a current location model object
   */
  normalizeCurrentLocation: function(payload) {
    let currentLocation = null;
    if (Ember.isArray(payload.content) && payload.content.length > 0) {
      const locationPayload = payload.content[0];
      currentLocation = CurrentLocationModel.create({
        classId: locationPayload.classId,
        courseId: locationPayload.courseId,
        unitId: locationPayload.unitId,
        lessonId: locationPayload.lessonId,
        collectionId: locationPayload.collectionId ? locationPayload.collectionId : locationPayload.assessmentId
      });
    }
    return currentLocation;
  }

});
