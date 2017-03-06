/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
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
    }
  };

  ENV.i18n = {
    defaultLocale: 'en',
    suppressWarnings: true
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

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.isTestEnv = true;

    ENV.APP.properties = {
      token: 'token',
      profileId: 'profile-id',
      collection: {
        id: '05d8c6fc-0ac7-4877-8179-7ee71e04dae3',
        title: 'Assessment Embedded Title'
      },
      teacher: {
        id: '2bcf48ff-a167-443b-b620-ad91d7b888e3',
        firstName: 'teacher-1',
        lastName: 'teacher-1',
        username: 'teacher-1',
        email: 'emailTeacher@gmail.com'
      },
      students: [
        {
          id: 'student-1',
          firstName: 'student-1',
          lastName: 'student-1',
          username: 'student-1',
          email: 'emailstudent-1@gmail.com'
        },
        {
          id: 'student-2',
          firstName: 'student-2',
          lastName: 'student-2',
          username: 'student-2',
          email: 'emailstudent-2@gmail.com'
        },
        {
          id: 'student-3',
          firstName: 'student-3',
          lastName: 'student-3',
          username: 'student-3',
          email: 'emailstudent-3@gmail.com'
        }
      ],
      context: {
        classId: 'class-id'
      }
    };
  }

  return ENV;
};
