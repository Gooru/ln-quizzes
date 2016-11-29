import AnalyticsAdapter from 'quizzes/adapters/analytics/analytics';
import UserSessionAdapter from 'quizzes/adapters/user-session';

export default {
  name: 'adapters',
  after: 'gooru-configuration',
  initialize: function(application) {
    application.register('adapter:analytics', AnalyticsAdapter, { singleton: false } );
    application.register('adapter:user-session', UserSessionAdapter, { singleton: false } );

    application.inject('service:api-sdk/analytics', 'analyticsAdapter', 'adapter:analytics');
    application.inject('service:api-sdk/user-session', 'userSessionAdapter', 'adapter:user-session');
  }
};
