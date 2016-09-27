import Ember from 'ember';
import ReportData from 'gooru-web/models/result/report-data';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for class performance
 * from analytics to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend(PrivateRouteMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  collectionService: Ember.inject.service('api-sdk/collection'),

  assessmentService: Ember.inject.service('api-sdk/assessment'),

  classService: Ember.inject.service("api-sdk/class"),


  // -------------------------------------------------------------------------
  // Actions

  actions: {

    navigateBack: function () {
      window.history.back();
    }

  },


  // -------------------------------------------------------------------------
  // Methods

  model: function (params) {
    const route = this;
    const classId = params.classId;
    const collectionId = params.collectionId;

    // Get initialization data from analytics
    return Ember.RSVP.hashSettled({
      assessment: route.get('assessmentService').readAssessment(collectionId),
      collection: route.get('collectionService').readCollection(collectionId)
    }).then(function(hash){
      const collectionFound = hash.assessment.state === 'rejected';
      let collection = collectionFound ? hash.collection.value : hash.assessment.value;

      return Ember.RSVP.hash({
        routeParams: Ember.Object.create({
          classId: classId,
          collectionId: collectionId
        }),
        collection: collection.toPlayerCollection(),
        classMembers: route.get('classService').readClassMembers(classId)
      });
    });
  },

  setupController: function (controller, model) {
    // Create an instance of report data to pass to the controller.
    const students = model.classMembers.get("members");
    var reportData = ReportData.create({
      students: students,
      resources: model.collection.get('resources')
    });

    controller.setProperties({
      routeParams: model.routeParams,
      assessment: model.collection,
      students: students
    });

    // Because there's an observer on reportData, it's important set all other controller properties beforehand
    controller.set('reportData', reportData);
  },

  resetController: function (controller) {
    const webSocketClient = controller.get('webSocketClient');
    if (webSocketClient !== null) {
      webSocketClient.disconnect();
    }

    // When exiting, reset the controller values
    controller.setProperties({
      routeParams: null,
      assessment: null,
      students: null,
      reportData: null,
      webSocketClient: null
    });
  }

});
