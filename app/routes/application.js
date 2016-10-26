import Ember from 'ember';
import GruTheme from '../utils/gru-theme';
import Env from '../config/environment';
import PublicRouteMixin from 'quizzes/mixins/public-route-mixin';
import GooruLegacyUrl from 'quizzes/utils/gooru-legacy-url';
import Error from 'quizzes/models/error';

/**
 * @typedef {object} ApplicationRoute
 */
export default Ember.Route.extend(PublicRouteMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  i18n: Ember.inject.service(),

  /**
   * @type {ClassService} Service to retrieve user information
   */
  classService: Ember.inject.service('api-sdk/class'),

  /**
   * @type {ConfigurationService} Service to retrieve configuration information
   */
  configurationService: Ember.inject.service('configuration'),

  /**
   * Authentication (api-sdk/session) service.
   * @property authService
   * @readOnly
   */
  authService: Ember.inject.service('api-sdk/session'),

  session: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:api-sdk/log
   */
  errorService: Ember.inject.service('api-sdk/error'),


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
    return route._super(...arguments).then(function(){
      if (Env.embedded) {
        route.handleEmbeddedApplication();
      }
    });
  },

  model: function(params) {
    const route = this;
    const currentSession = route.get('session.data.authenticated');
    const themeConfig = Env.themes || {};
    const themeId = params.themeId || Env.themes.default;
    let myClasses = null;

    var theme = null;
    if (themeId && themeConfig[themeId]){
      theme = GruTheme.create(themeConfig[themeId]);
      theme.set('id', themeId);
    }

    if (!currentSession.isAnonymous) {
      myClasses = route.get('classService').findMyClasses();
    }

    return Ember.RSVP.hash({
      currentSession: currentSession,
      theme: theme,
      translations: theme ? theme.loadTranslations() : null,
      myClasses: myClasses
    });
  },

  afterModel: function(){
    this.handleLegacyUrlIfNecessary();
  },

  setupController: function(controller, model) {
    const theme = model.theme;
    if (theme){
      controller.set('theme', theme);
      this.setupTheme(theme, model.translations);
    }

    if (model.myClasses) {
      controller.set('myClasses', model.myClasses);
    }
  },

  /**
   * Setups the application theme
   * @param {GruTheme} theme
   * @param {*} translations
   */
  setupTheme: function(theme, translations){
    this.setupThemeStyles(theme);
    this.setupThemeTranslations(theme.get('translations.locale'), translations);
  },

  /**
   * Setups theme translations
   * @param {string} locale theme locale
   * @param {{}} translations theme translations
   */
  setupThemeTranslations: function(locale, translations){
    const i18n = this.get('i18n');
    //sets the theme locale
    i18n.set('locale', locale);

    //Add the translations
    Object.keys(translations).forEach((locale) => {
      i18n.addTranslations(locale, translations[locale]);
    });
  },

  /**
   * Sets the theme styles if available
   * @param {GruTheme} theme
   */
  setupThemeStyles: function(theme){
    //setting theme id at html tag
    Ember.$('html').attr('id', theme.get('id'));
    //adding theme styles to head tag
    const themeStylesUrl = theme.get('styles.url');
    if (themeStylesUrl){
      Ember.$('head').append(`<link id="theme-style-link" rel="stylesheet" type="text/css" href="${themeStylesUrl}">`);
    }
  },

  /**
   * Handles a url when necessary
   */
  handleLegacyUrlIfNecessary: function() {
    const route = this;
    const legacyUrl = GooruLegacyUrl.create({
      url: route.get('router.url')
    });

    if (legacyUrl.get('isLegacyUrl')) { //checking for a legacy legacyUrl
      const routeParams = legacyUrl.get('routeParams');
      if (routeParams) {
        route.transitionTo.apply(route, routeParams);
      }
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

    // do not track errors at the user-error api, this to prevent a loop
    if (settings.url.indexOf('api/nucleus-utils/v1/user-error') >= 0 ) {
      return;
    }

    const targetElement = event.currentTarget && event.currentTarget.activeElement ?
      event.currentTarget.activeElement : false;
    const model = Error.create({
      type: 'url',
      timestamp: new Date().getTime(),
      userId: (route.get('session.isAnonymous') ? 'anonymous' : route.get('session.userId')),
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

    route.get('errorService').createError(model);
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
      userId: (route.get('session.isAnonymous') ? 'anonymous' : route.get('session.userId')),
      details: {
        route: route.get('router.url'),
        userAgent: navigator.userAgent,
        stack: error.stack
      },
      description: JSON.stringify(error)
    });

    Ember.Logger.error(error);
    route.get('errorService').createError(model);
  },

  deactivate: function () {
    Ember.$(document).off('ajaxError');
  },

  /**
   * Handle the logic for the embedded application
   * @returns {Promise.<TResult>}
   */
  handleEmbeddedApplication: function () {
    const route = this;
    const transition = Env.APP.transition;
    const configurationService = route.get('configurationService');
    configurationService.addProperties(Env.APP.properties);

    const token = Env.APP.token;
    const authService = this.get('authService');
    const authPromise = token ?
      authService.signInWithToken(token) :
      authService.get('session').authenticateAsAnonymous();

    return authPromise.then(function(){
      const routeName = 'sign-in';
      if (transition){
        route.transitionTo.apply(route, transition);
      }
      else {
        route.transitionTo(routeName);
      }
    });
  },


// -------------------------------------------------------------------------
  // Actions - only transition actions should be placed at the route
  actions: {
    /**
     * Action triggered when submitting the login form
     * @see application.hbs
     * @see gru-header.hbs
     */
    signIn: function () {
      const route = this;
      route.actions.updateUserClasses.call(this).then( // Required to get list of classes after login
        function() {
          route.transitionTo('home');
        }
      );
    },

    /**
     * Action triggered when login out
     */
    logout: function () {
      this.transitionTo('logout');
    },

    /**
     * Action triggered when the user search for collections
     * @see application.hbs
     * @see gru-header.js
     */
    searchTerm: function (term) {
      const routeName = this.get('controller.currentRouteName');
      if (routeName.indexOf('search') >= 0) {
        this.set('controller.term', term);
      }
      else {
        this.transitionTo(`/search/collections?term=${term}`);
      }
    },

    /**
     * Gets a refreshed list of user classes
     * @see create.js
     * @see join.js
     */
    updateUserClasses: function() {
      const route = this;
      return route.get('controller').loadUserClasses();
    }
  }

});
