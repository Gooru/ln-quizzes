import Ember from 'ember';
import Env from 'dummy/config/environment';
import Error from 'quizzes-addon/models/error';

/**
 * @typedef {object} ApplicationRoute
 */
export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  i18n: Ember.inject.service(),

  /**
   * @type {ConfigurationService} Service to retrieve configuration information
   */
  configurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service('quizzes/notifications'),

  // -------------------------------------------------------------------------
  // Methods

  setupGlobalErrorHandling: Ember.on('init', function () {
    const route = this;

    // Ultimately all server and javascript errors will be caught by this handler
    Ember.onerror = function (error) {
      if(error.status !== 401) {
        const errorMessage = route.get('i18n').t('common.unexpectedError').string;
        route.get('notifications').error(errorMessage);
        route.trackAppError(error);
      }
    };

    Ember.$(document).ajaxError(function(event, jqXHR, settings) {
      if(jqXHR.status !== 401) {
        route.trackEndPointError(event, jqXHR, settings);
      }
    });

  }),

  beforeModel: function() {
    const route = this;
    if (Env.isTestEnv) {
      const configurationService = route.get('configurationService');
      configurationService.addProperties(Env.APP.properties);
    }
  },


  /**
   * Tracks end point errors
   * @param event
   * @param jqXHR
   * @param settings
     */
  trackEndPointError : function(event, jqXHR, settings){
    const route = this;
    const targetElement = event.currentTarget && event.currentTarget.activeElement ?
      event.currentTarget.activeElement : false;
    const model = Error.create({
      type: 'url',
      timestamp: new Date().getTime(),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        'element-selector': (targetElement ? targetElement.className: null),
        endpoint: {
          url: settings.url,
          response: jqXHR.responseText,
          status: jqXHR.status,
          headers: settings.headers,
          responseHeaders: jqXHR.getAllResponseHeaders(),
          method: settings.type,
          data: settings.data
        }
      },
      description: 'Endpoint error'
    });
    Ember.Logger.error(model);
  },

  /**
   * Tracks application/js errors
   * @param error
   */
  trackAppError : function(error){
    const route = this;

    // do not track errors at the user-error api, this to prevent a loop
    if (error.responseText && error.responseText.indexOf('api/nucleus-utils/v1/user-error') >= 0 ) {
      return;
    }

    const model = Error.create({
      type: 'page',
      timestamp: new Date().getTime(),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        stack: error.stack
      },
      description: JSON.stringify(error)
    });

    Ember.Logger.error(model);
    Ember.Logger.error(error);
  },

  deactivate: function () {
    Ember.$(document).off('ajaxError');
  }
});
