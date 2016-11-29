import UserSessionAdapter from 'quizzes/adapters/user-session';

export default {
  name: 'adapters',
  after: 'gooru-configuration',
  initialize: function(application) {
    application.register('adapter:user-session', UserSessionAdapter, { singleton: false } );

    application.inject('service:api-sdk/user-session', 'userSessionAdapter', 'adapter:user-session');
  }
};
