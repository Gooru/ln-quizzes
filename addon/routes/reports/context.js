import Ember from 'ember';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for context events
 * from BE to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({
  queryParams: {
    anonymous: {}
  },

  /**
   * @type {AttemptService} attemptService
   * @property {Ember.Service} Service to send context related events
   */
  quizzesAttemptService: Ember.inject.service('quizzes/attempt'),

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  quizzesCollectionService: Ember.inject.service('quizzes/collection'),

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @type {ProfileService} profileService
   * @property {Ember.Service} Service to send profile related events
   */
  quizzesProfileService: Ember.inject.service('quizzes/profile'),

  /**
   * @type {ClassService} classService
   * @property {Ember.Service} Service to send class related events
   */
  quizzesClassService: Ember.inject.service('quizzes/class'),

  // -------------------------------------------------------------------------
  //  Properties

  /**
   * It has the list params in object
   * @property {Object}
   */
  modelParams: null,

  /**
   * It has the collection
   * @property {Collection}
   */
  collection: null,

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Navigate to the previous page
     */
    navigateBack: function() {
      // Empty, it does nothing by default
    },

    reloadReportData: function() {
      this.loadReportData();
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @param {{ contextId: string }} params
   */
  model: function(params) {
    return this.quizzesModel(params);
  },

  /**
   * @param {{ contextId: string }} params
   */
  quizzesModel: function(params) {
    const route = this;
    const contextId = params.contextId;
    const anonymous = params.anonymous;
    const students = params.students || [];
    const type =
      params.type ||
      route.get('quizzesConfigurationService.configuration.properties.type');
    params.type = type;
    route.set('modelParams', params);
    return route
      .get('quizzesAttemptService')
      .getReportData(contextId)
      .then(reportData => {
        students
          .filter(
            student =>
              !reportData.get('reportEvents').findBy('profileId', student.id)
          )
          .forEach(student => {
            reportData.get('reportEvents').push(
              ReportDataEvent.create(Ember.getOwner(this).ownerInjection(), {
                profileId: student.get('id'),
                profileName: student.get('fullName'),
                lastFirstName: student.get('lastFirstName'),
                isAttemptStarted: false,
                isAttemptFinished: false
              })
            );
          });
        return reportData;
      })
      .then(reportData =>
        Ember.RSVP.hash({
          anonymous,
          reportData,
          collection: route
            .get('quizzesCollectionService')
            .readCollection(reportData.collectionId, type),
          profiles: route
            .get('quizzesProfileService')
            .readProfiles(
              reportData.get('reportEvents').map(({ profileId }) => profileId)
            )
        })
      );
  },

  setupController(controller, model) {
    const anonymous = model.anonymous;
    const collection = model.collection;
    const reportData = model.reportData;
    const profiles = model.profiles;
    reportData.get('reportEvents').forEach(function(reportEvent) {
      const profile = profiles[reportEvent.get('profileId')];
      reportEvent.setProfileProperties(profile);
    });
    this.set('collection', collection);
    reportData.setCollection(collection);
    controller.set('reportData', reportData);
    controller.set('anonymous', anonymous);
  },

  deactivate: function() {
    const webSocketClient = this.get('controller').get('webSocketClient');
    if (webSocketClient) {
      webSocketClient.disconnect();
    }
  },

  loadReportData: function() {
    const route = this;
    const params = route.get('modelParams');
    const contextId = params.contextId;
    const classId = params.classId;
    route
      .get('quizzesClassService')
      .readClassMembers(classId)
      .then(data => {
        const students = data.members;
        route
          .get('quizzesAttemptService')
          .getReportData(contextId)
          .then(reportData => {
            students
              .filter(
                student =>
                  !reportData
                    .get('reportEvents')
                    .findBy('profileId', student.id)
              )
              .forEach(student => {
                reportData.get('reportEvents').push(
                  ReportDataEvent.create(
                    Ember.getOwner(this).ownerInjection(),
                    {
                      profileId: student.get('id'),
                      profileName: student.get('fullName'),
                      lastFirstName: student.get('lastFirstName'),
                      isAttemptStarted: false,
                      isAttemptFinished: false
                    }
                  )
                );
              });
            return reportData;
          })
          .then(reportData => {
            Ember.RSVP
              .hash({
                reportData,
                profiles: route
                  .get('quizzesProfileService')
                  .readProfiles(
                    reportData
                      .get('reportEvents')
                      .map(({ profileId }) => profileId)
                  )
              })
              .then(({ reportData, profiles }) => {
                reportData.get('reportEvents').forEach(function(reportEvent) {
                  const profile = profiles[reportEvent.get('profileId')];
                  reportEvent.setProfileProperties(profile);
                });
                reportData.setCollection(route.get('collection'));
                route.get('controller').set('reportData', reportData);
                route.get('controller').onReloadData();
              });
          });
      });
  }
});
