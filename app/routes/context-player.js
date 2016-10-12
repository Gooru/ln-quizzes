import Ember from 'ember';

/**
 * @typedef { Ember.Route } PlayerRoute
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Methods
  /**
   * @param {{ collectionId: string, resourceId: string }} params
   */
  model(params) {
    const route = this;
    const data = {
      collectionId: params.collectionId,
      context: {
        classId: params.classId,
        courseId: params.courseId,
        unitId: params.unitId,
        lessonId: params.lessonId
      }
    };
    const url = 'http://mockbin.org/bin/f812616f-7d6b-411e-b229-a24a645759b7';
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      data: JSON.stringify(data)
    };
    return Ember.$.ajax(url, options).then(function(response){
      route.transitionTo('player', JSON.parse(response).contextId, params.collectionId);
    });
  }
});
