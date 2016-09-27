import Ember from 'ember';
import PlayerRoute from 'gooru-web/routes/player';
import Context from 'gooru-web/models/result/context';
import {generateUUID} from 'gooru-web/utils/utils';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";

/**
 * Context Player Route
 *
 * The context player route extends the player route to provide the context player
 * controller with additional information available only to signed-in users
 *
 * @module
 * @extends PlayerRoute
 */
export default PlayerRoute.extend(PrivateRouteMixin, {


  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type LessonService
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),
  performanceService: Ember.inject.service('api-sdk/performance'),
  classService: Ember.inject.service('api-sdk/class'),

  // -------------------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Gets player model, overrides parent method and loads lesson
   * @param {*} params
   * @param {Context} context
   * @param {Collection} collection
   * @returns {Promise.<*>}
   */
  playerModel: function(params, context, collection, originalCollection) {
    const route = this;
    return this._super(params, context, collection).then(function(model) {
      const classId = context.get('classId');
      const courseId = context.get('courseId');
      const unitId = context.get('unitId');
      const lessonId = context.get('lessonId');
      const userId = context.get('userId');

      model.originalCollection = originalCollection;

      return Ember.RSVP.hash({
        lesson: route.get('lessonService').fetchById(courseId, unitId, lessonId),
        class: route.get('classService').readClassInfo(classId)
      }).then(function(hash) {
          model.lesson = hash.lesson;
          model.class = hash.class;
          const maxAttempts = collection.get('attempts');
          if (collection.get('hasUnlimitedAttempts')) {
            model.assessmentAttemptsLeft = maxAttempts;
            return model;
          } else {
            return route.get('performanceService')
              .findStudentPerformanceByLesson(userId, classId, courseId, unitId, lessonId, [collection])
              .then(function(result) {
                const currentAttempts = result[0].get('attempts');
                const attemptsLeft = maxAttempts - currentAttempts;
                model.assessmentAttemptsLeft = (attemptsLeft > 0) ? attemptsLeft : 0;
                return model;
              });
          }
      });
    });
  },

  setupController(controller, model) {
    const collection = model.collection;
    controller.set('onAir', true); //TODO check for onAir
    controller.set('lesson', model.lesson);
    controller.set('showContent', collection.get('isCollection'));
    controller.set('originalCollection', model.originalCollection);
    controller.set('class', model.class);
    if (collection.get('isAssessment')) {
      controller.set('assessmentAttemptsLeft', model.assessmentAttemptsLeft);
    }
    // Call parent method
    this._super(...arguments);
  },

  /**
   * Get the player context
   * @param params
   * @returns {Context}
   */
  getContext: function(params){
    const route = this;
    const userId = route.get('session.userId');
    const collectionId = params.collectionId;
    const courseId = params.courseId;
    const unitId = params.unitId;
    const lessonId = params.lessonId;

    return Context.create({
      userId: userId,
      collectionId: collectionId,
      parentEventId: generateUUID(), //TODO is this coming from BE?
      courseId: courseId,
      classId: params.classId,
      unitId: unitId,
      lessonId: lessonId
    });
  },

  deactivate: function(){
    this.get('controller').set('showContent',false);
    // Call parent method
    this._super(...arguments);
  }

});
