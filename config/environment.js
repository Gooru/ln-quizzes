/* jshint node: true */

module.exports = function (environment) {

  var isEmbedded = process.env.QUIZZES_EMBEDDED === 'true';

  var ENV = {
    modulePrefix: 'quizzes',
    rootElement: "#quizzes-application-container",
    environment: environment,
    rootURL: isEmbedded ? undefined : '/',
    locationType: isEmbedded ? 'none' : 'auto',
    exportApplicationGlobal: "QuizzesWebApp",
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    embedded: {
      //Add anything you want as default values
    },

    marketingSiteUrl: "/welcome",
    supportSiteUrl: "http://support.gooru.org",
    toolkitSiteUrl:"http://about.gooru.org/toolkit",
    termsConditionsUrl:"http://about.gooru.org/terms-and-conditions"
  };

  ENV.embedded = isEmbedded;

  ENV.i18n = {
    defaultLocale: 'en'
  };

  ENV['ember-simple-auth'] = {
    baseURL: '/'
  };

  /**
   * Application themes configuration
   */
  ENV.themes = {
    'default': null, /* when present it is not necessary to pass a query param */
    'edify' : {
      'translations': {
        'locale': 'en-edify', /* this way it fallback to 'en' */
        'url': '/themes/edify/translations.json'
      },
      'styles': {
        'url': '/themes/edify/styles.css'
      }
    }
  };

  ENV.player = {
    vimeoPlayerUrl:'//player.vimeo.com/video/',
    youtubePlayerUrl:'https://www.youtube.com/embed/'
  };

  ENV.events = {
    apiVersion: '3.0',
    playerEventEndpoint: '/api/log/event',
    eventAPIKey: '33b9ad34-1a0c-43ba-bb9c-4784abe07110'
  };

  ENV['simple-auth-custom'] = {
    apiKey: 'ASERTYUIOMNHBGFDXSDWERT123RTGHYT',
    serverTokenEndpoint: '/gooruapi/rest/v2/account/login',
    anonymousEndpoint: '/gooruapi/rest/v2/account/loginas/anonymous'
  };

  ENV['API-3.0'] = {
    clientKey : "c2hlZWJhbkBnb29ydWxlYXJuaW5nLm9yZw==",
    clientId: "ba956a97-ae15-11e5-a302-f8a963065976",
    'user-token-api-2.0': '0e22e273-e2aa-4a6e-9e4f-c4d376c5317b',
    'anonymous-token-api-2.0': '00ed3b76-bffa-4372-90b0-00f886ce2584'
  };

  ENV['google-sign-in'] = {
    url: '/api/nucleus-auth-idp/v1/google'
  };


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'unsafe-eval' 'unsafe-inline' 'self' http://localhost:4200 http://localhost",
      'font-src': "'self' https://www.gooru.org",
      'connect-src': "'self' http://localhost:4200 ws://localhost:4200 http://localhost:8882 https://qa.api.quizzes.edify.cr",
      'img-src': "'self' data: http://qacdn.gooru.org http://profile-images.goorulearning.org.s3.amazonaws.com " +
        "http://dev-content-gooru-org.s3-us-west-1.amazonaws.com http://dev-user-gooru-org.s3-us-west-1.amazonaws.com",
      'style-src': "'self' 'unsafe-inline' https://www.gooru.org",
      'media-src': "'self'"
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV['ember-simple-auth'].store = 'session-store:ephemeral';

    ENV.APP.rootElement = '#ember-testing';
    ENV.embedded = false;
  }

  if (environment === 'production' && !isEmbedded) {
    ENV.googleAnalytics = {
      webPropertyId: 'UA-79540131-1',
      tracker: "analytics.js",
      globalVariable: "hewlettOERTracker",
      cookieName: "hewlettOERCookie"
    };
  }

  return ENV;
};
