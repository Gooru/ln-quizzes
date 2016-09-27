import Ember from 'ember';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";

export default Ember.Route.extend(PrivateRouteMixin, {

  queryParams: {
    refresh: {
      refreshModel: true
    }
  },


  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Session} current session
   */
  session: Ember.inject.service("session"),

  /**
   * @type {UserService} Service to retrieve user information
   */
  userService: Ember.inject.service("api-sdk/user"),

  /**
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service("api-sdk/class"),

  /**
   * @type {CourseService} Service to retrieve course information
   */
  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @type {UnitService} Service to retrieve unit information
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    const route = this;
    const classId = params.classId;

    return route.get('classService').readClassInfo(classId)
      .then(function(classObj) {
        return route.get('classService').readClassMembers(classId)
          .then(function(members) {
            classObj.set('owner', members.get('owner'));
            classObj.set('collaborators', members.get('collaborators'));
            classObj.set('members', members.get('members'));

            const courseId = classObj.get('courseId');
            if (courseId) {
              return route.get('courseService').fetchById(courseId)
                .then(function(course) {
                  return Ember.RSVP.hash({
                    class: classObj,
                    course: course,
                    members: members,
                    units: course.get('children')
                  });
                });
            } else {
              // TODO It is required to implement the Get Course Info and the get Units
              // This code was change to support the new API, a lot of functionality inside class rount is not working at this moment
              return Ember.RSVP.hash({
                class: classObj,
                course: Ember.Object.create({}),
                members: members,
                units: []
              });
            }
          });
      });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set("class", model.class);
    controller.set("course", model.course);
    controller.set("units", model.units);
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Triggered when a class menu item is selected
     * @param {string} item
     */
    selectMenuItem: function(item){
      const route = this;
      const controller = route.get("controller");
      const aClass = controller.get('class');
      const isTeacher = aClass.isTeacher(this.get("session.userId"));
      controller.selectMenuItem(item);

      if ((item === "analytics.performance") && isTeacher){
        route.transitionTo('class.analytics.performance.teacher.course');
      } else if ((item === "analytics.performance") && !isTeacher) {
        route.transitionTo('class.analytics.performance.student');
      } else {
        route.transitionTo('class.' + item);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  /**
   * This event handlers reset some class properties when leaving the route
   */
  handleDeactivate: function() {
    this.get("controller").exitFullScreen();
  }.on('deactivate')

});
