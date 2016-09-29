import AnalyticsAdapter from 'quizzes/adapters/analytics/analytics';
import CollectionResourceAdapter from 'quizzes/adapters/events/collection-resource-play';
import CollectionPlayAdapter from 'quizzes/adapters/events/collection-play';
import RealTimeAdapter from 'quizzes/adapters/real-time/real-time';
import StudentCollectionPerformanceAdapter from 'quizzes/adapters/performance/student-collection-performance';
import UserSessionAdapter from 'quizzes/adapters/user-session';

export default {
  name: 'adapters',
  after: 'gooru-configuration',
  initialize: function(application) {
    application.register('adapter:analytics', AnalyticsAdapter, { singleton: false } );
    application.register('adapter:collection-resource-play', CollectionResourceAdapter, { singleton: false } );
    application.register('adapter:collection-play', CollectionPlayAdapter, { singleton: false } );
    application.register('adapter:real-time', RealTimeAdapter, { singleton: false } );
    application.register('adapter:student-collection-performance', StudentCollectionPerformanceAdapter, { singleton: false } );
    application.register('adapter:user-session', UserSessionAdapter, { singleton: false } );

    application.inject('service:api-sdk/analytics', 'analyticsAdapter', 'adapter:analytics');
    application.inject('service:api-sdk/events', 'collectionResourceAdapter', 'adapter:collection-resource-play');
    application.inject('service:api-sdk/events', 'collectionPlayAdapter', 'adapter:collection-play');
    application.inject('service:api-sdk/performance', 'studentCollectionAdapter', 'adapter:student-collection-performance');
    application.inject('service:api-sdk/real-time', 'realTimeAdapter', 'adapter:real-time');
    application.inject('service:api-sdk/user-session', 'userSessionAdapter', 'adapter:user-session');
  }
};
