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
  model() {
    const route = this;
    /*const data = {
      collectionId: params.collectionId,
      context: {
        classId: params.classId,
        courseId: params.courseId,
        unitId: params.unitId,
        lessonId: params.lessonId
      }
    };
    const url = '';
    const options = {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      processData: false,
      data: JSON.stringify(data)
    };
    return Ember.$.ajax(url, options).then(function(response){
      route.transitionTo('player', JSON.parse(response).contextId, params.collectionId);
    });*/
    route.transitionTo('player', '13751490-5544-4d22-a506-111c750837c4');
  }
});
