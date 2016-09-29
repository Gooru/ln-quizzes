import Ember from "ember";
import { REAL_TIME_CLIENT } from 'quizzes/config/config';
import EndPointsConfig from 'quizzes/utils/endpoint-config';

/**
 *
 * Controller for collection/assessment report
 *
 * Controls the gathering and merging of class performance data
 * for a collection/assessment
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Controller.extend({

  queryParams: ['anonymous'],


  // -------------------------------------------------------------------------
  // Dependencies

  i18n: Ember.inject.service(),

  notifications: Ember.inject.service(),

  realTimeService: Ember.inject.service('api-sdk/real-time'),


  // -------------------------------------------------------------------------
  // Actions

  actions: {

    goBack: function () {
      this.send('navigateBack');
    },

    launchAnonymous: function () {
      var url = window.location.href;

      url += "?anonymous=true";
      window.open(url, 'realTimeAnonymous', 'width=' + window.screen.width + ', height=' + window.screen.height + ', left=0, top=0, scrollbars=1', true);
    }
  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean}
   */
  anonymous: false,

  /**
   * @property {Collection} assessment
   */
  assessment: null,

  /**
   * @property {boolean} is a notification regarding the connection currently being displayed
   */
  isNotificationDisplayed: false,

  /**
   * @property {ReportData} report data
   */
  reportData: null,

  /**
   * @property {Object} routeParams - URL dynamic route segments
   */
  routeParams: null,

  /**
   * @property {User[]} students
   */
  students: Ember.A([]),

  /**
   * @property { Object } webSocketClient - web socket client for getting live data
   * from the Real Time server
   */
  webSocketClient: null,
  /**
   * @property {boolean} isRealTime
   */
  isRealTime:true,
  /**
   * @property {boolean} showAttempts
   */
  showAttempts:false,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observe when the 'reportData' object has been set by the route.
   * At this point, it is possible to proceed with the creation of the websocket
   * to communicate with the real time server and safely merge any initialization
   * data from the real time server as well
   */
  reportDataLoaded: Ember.observer('reportData', function () {
    const classId = this.get('routeParams.classId');
    const collectionId = this.get('routeParams.collectionId');
    const reportData = this.get('reportData');

    if (reportData) {
      this.connectWithWebSocket(classId, collectionId, reportData);
    }
  }),


  // -------------------------------------------------------------------------
  // Methods

  connectWithWebSocket: function (classId, collectionId, reportData) {

    // Create a new web socket connection
    let url = EndPointsConfig.getRealTimeWebSocketUrl();
    let socket = new SockJS(url);
    let webSocketClient = Stomp.over(socket);
    webSocketClient.heartbeat.outgoing = REAL_TIME_CLIENT.OUTGOING_HEARTBEAT;
    webSocketClient.heartbeat.incoming = REAL_TIME_CLIENT.INCOMING_HEARTBEAT;

    this.set('webSocketClient', webSocketClient);

    webSocketClient.connect({}, function () {
      var controller = this;

      // Clear a failed connection notification, if there was one
      this.clearNotification();

      // A web socket connection was made to the RT server. Before subscribing
      // for live messages, a request will be made to fetch any initialization data
      // from the RT server (to avoid overriding data from live messages with init data)
      this.get('realTimeService').findResourcesByCollection(classId, collectionId)
        .then(function (userResourceResults) {
          const channel = classId + '_' + collectionId;

          // Subscribe to listen for live messages
          webSocketClient.subscribe('/topic/' + channel, function (message) {
            var eventMessage = JSON.parse(message.body);
            const userResourceResult = controller.get('realTimeSerializer').normalizeRealTimeEvent(eventMessage);
            reportData.merge([userResourceResult]);
          });

          // Merge any init data from the RT server with any
          // previous report data
          reportData.merge(userResourceResults);
        });

    }.bind(this), function () {
      var connectAttemptDelay = REAL_TIME_CLIENT.CONNECTION_ATTEMPT_DELAY;

      this.showNotification();
      webSocketClient.disconnect();
      webSocketClient = null;

      setTimeout(function () {
        // Make a recursive call to try to reconnect
        this.connectWithWebSocket(classId, collectionId, reportData);
      }.bind(this), connectAttemptDelay);

    }.bind(this)).bind(this);
  },

  showNotification: function () {
    var isDisplayed = this.get('isNotificationDisplayed');

    if (!isDisplayed) {
      let notifications = this.get('notifications');
      let message = this.get('i18n').t('common.warnings.on-air-connection-lost').string;

      // Use custom options for the notification
      notifications.setOptions({
        closeButton: false,
        newestOnTop: true,
        progressBar: false,
        positionClass: "toast-top-full-width",
        preventDuplicates: false,
        showDuration: 300,
        hideDuration: 1000,
        "timeOut": "0",
        "extendedTimeOut": "0",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
      });
      notifications.warning(message);
      this.set('isNotificationDisplayed', true);
    }
  },

  clearNotification: function () {
    this.get('notifications').clear();
    this.set('isNotificationDisplayed', false);
  }

});
