import Ember from 'ember';

import { createDataMatrix } from 'gooru-web/utils/performance-data';

/**
 * Teacher Analytics Performance Route - Course Level
 *
 * Route responsible of the transitions and loading the model/data for the teacher class performance at course level
 *
 * @module
 * @augments ember/Controller
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @type {UnitService}
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  /**
   * @type {PerformanceService}
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * navigateToUnits
    */
    navigateToUnits: function(unitId){
      this.transitionTo('class.analytics.performance.teacher.unit', unitId);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function() {
    const route = this;
    const filterBy = route.paramsFor('class.analytics.performance.teacher').filterBy;
    const classModel = route.modelFor('class').class;
    const units = route.modelFor('class').units;
    const classId = classModel.get('id');
    const courseId = classModel.get('courseId');
    const members = classModel.get('members');
    const classPerformanceData = route.get('performanceService').findClassPerformance(classId, courseId, members, {collectionType: filterBy});

    return Ember.RSVP.hash({
      units: units,
      classPerformanceData: classPerformanceData
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    const performanceData = createDataMatrix(model.units, model.classPerformanceData);
    controller.set('performanceDataMatrix', performanceData);
    controller.set('units', model.units);

    //updating breadcrumb when navigating back to course
    controller.get("teacherController").updateBreadcrumb(controller.get("course"), "course");
    //updating the collectionLevel to show or not the launch anonymous button
    controller.set("teacherController.collectionLevel", false);
  }

});
