import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

/**
 * Student Analytics Performance Route
 *
 * Route responsible of the transitions and loading the model/data for the student performance
 *
 * @module
 * @see routes/analytics/performance/student.js
 * @augments ember/Controller
 */
export default Ember.Route.extend(ApplicationRouteMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  performanceService: Ember.inject.service('api-sdk/performance'),

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function(params) {
    const classModel = this.modelFor('class').class;
    const units = this.modelFor('class').units;
    const userId = this.get('session.userId');
    const classId= classModel.get('id');
    const courseId = classModel.get('courseId');
    // TODO This need to be reverted once we have the Collection Type dropdown with Collection and Both options enabled.
    const collectionType = params.filterBy ? {collectionType: params.filterBy} : {collectionType: 'assessment'};
    const unitPerformances = this.get('performanceService').findStudentPerformanceByCourse(userId, classId, courseId, units, collectionType);
    return Ember.RSVP.hash({
      userId:userId,
      classModel:classModel,
      units: units,
      unitPerformances: unitPerformances
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('performances', model.unitPerformances);
    controller.set('userId', model.userId);
    controller.set('classModel', model.classModel);
    controller.set('units', model.units);
    controller.get('classController').selectMenuItem('analytics.performance');
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action thrown on the model hook when it detects a promise.
     * @param transition - it is the transition promise.
     */
    loading(transition) {
      let controller = this.controllerFor('class');
      controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
        controller.set('currentlyLoading', false);
      });
    },
    /**
     * Open the player with the specific collection/assessment
     *
     * @function actions:playItem
     * @param {string} unitId - Identifier for an unit
     * @param {string} lessonId - Identifier for a lesson
     * @param {string} collection - collection or assessment
     */
    playResource: function (unitId, lessonId, collection) {
      const currentClass = this.modelFor('class').class;
      const classId = currentClass.get("id");
      const courseId = currentClass.get("courseId");
      const role = this.get("controller.isStudent") ? "student" : "teacher";
      if (collection.get("isExternalAssessment")){
        window.open(collection.get("url")); //todo url?
      }
      else {
        this.transitionTo('context-player', classId, courseId, unitId,
          lessonId, collection.get("id"), { queryParams: { role: role, type: collection.get("collectionType") }});
      }
    },
    /**
     * Open the assessment report
     *
     * @function actions:viewReport
     * @param {string} unitId - Identifier for an unit
     * @param {string} lessonId - Identifier for a lesson
     * @param {string} collection - collection or assessment
     */
    viewReport: function (unitId, lessonId, collection) {
      const currentClass = this.modelFor('class').class;
      const userId = this.get('session.userId');
      const classId = currentClass.get("id");
      const courseId = currentClass.get("courseId");
      this.transitionTo('reports.student-collection', { queryParams: {
          classId: classId,
          courseId: courseId,
          unitId: unitId,
          lessonId: lessonId,
          collectionId: collection.get("id"),
          userId: userId,
          type: collection.get("type"),
          role: "student"
        }});
    }
  }

});
