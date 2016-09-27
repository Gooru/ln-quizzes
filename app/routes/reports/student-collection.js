import Ember from 'ember';
import Context from 'gooru-web/models/result/context';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";
/**
 *
 * Analytics data for a student related to a collection of resources
 * Gathers and passes the necessary information to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend(PrivateRouteMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service("session"),

  /**
   * @property {Ember.Service} Service to retrieve an assessment result
   */
  userSessionService: Ember.inject.service("api-sdk/user-session"),

  /**
   * @property {AssessmentService} Service to retrieve an assessment
   */
  assessmentService: Ember.inject.service("api-sdk/assessment"),

  /**
   * @property {CollectionService} Service to retrieve a collection
   */
  collectionService: Ember.inject.service("api-sdk/collection"),

  /**
   * @property {LessonService} Service to retrieve a lesson
   */
  lessonService: Ember.inject.service("api-sdk/lesson"),


  // -------------------------------------------------------------------------
  // Actions
  actions: {
    goBack: function() {
      const route = this;
      const controller = route.get("controller");
      const context = controller.get("context");
      if (context.get("lessonId")){
        controller.get("isTeacher") ? route.backToCourseMap() : route.backToData();
      }
      else {
        const toRoute = controller.get("backUrl") || 'index'; //index when refreshing the page, TODO fix
        this.transitionTo(toRoute);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ assessmentId: string, resourceId: string }} params
   */
  model(params) {
    const route = this;
    const context = route.getContext(params);
    const type = params.type || "collection";

    const lessonPromise = context.get("courseId") ?
      route.get("lessonService").fetchById(context.get("courseId"), context.get("unitId"), context.get("lessonId")) :
      null;

    const isCollection = (type === "collection");
    const collectionPromise = (isCollection) ?
      route.get("collectionService").readCollection(params.collectionId) :
      route.get("assessmentService").readAssessment(params.collectionId);
    const completedSessionsPromise = (isCollection) ? [] :
      route.get("userSessionService").getCompletedSessions(context);
    return Ember.RSVP.hash({
      collection: collectionPromise,
      completedSessions : completedSessionsPromise,
      lesson: lessonPromise,
      context: context
    });
  },

  /**
   *
   * @param controller
   * @param model
   * @returns {Promise.<T>}
   */
  setupController: function(controller, model){
    var completedSessions = model.completedSessions;
    const totalSessions = completedSessions.length;
    const lastCompletedSession = totalSessions ? completedSessions[totalSessions - 1] : null;
    controller.set("collection", model.collection.toPlayerCollection());
    controller.set("lesson", model.lesson);
    controller.set("completedSessions", completedSessions);
    controller.set("context", model.context);
    controller.loadSession(lastCompletedSession);
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
      collectionType: params.type,
      userId: userId,
      collectionId: collectionId,
      courseId: courseId,
      classId: params.classId,
      unitId: unitId,
      lessonId: lessonId
    });
  },

  /**
   * Take the user back to data page
   */
  backToData: function () {
    const route = this;
    const controller = route.get("controller");
    const context = controller.get("context");

    route.transitionTo("class.analytics.performance.student", context.get("classId"),
    {
      queryParams: {
        unitId: context.get("unitId"),
        lessonId: context.get("lessonId")
      }
    });
  },

  /**
   * Take the user back to course map page
   */
  backToCourseMap: function () {
    const route = this;
    const controller = route.get("controller");
    const context = controller.get("context");
    const unitId = context.get("unitId");
    const lessonId = context.get("lessonId");
    route.transitionTo("class.overview", context.get("classId"),
    {
      queryParams: {
        location: `${unitId}+${lessonId}`
      }
    });
  },

  deactivate: function(){
    this.get("controller").resetValues();
  }


});
