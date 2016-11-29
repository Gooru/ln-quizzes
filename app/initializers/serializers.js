import ContextSerializer from 'quizzes/serializers/context/context';
import UserSessionSerializer from 'quizzes/serializers/user-session';

export default {
  name: 'serializers',
  after: 'gooru-configuration',
  initialize: function(application) {
    application.register('serializer:context', ContextSerializer, { singleton: false } );
    application.register('serializer:user-session', UserSessionSerializer, { singleton: false } );

    application.inject('service:api-sdk/context', 'contextSerializer', 'serializer:context');
    application.inject('service:api-sdk/user-session', 'userSessionSerializer', 'serializer:user-session');
  }
};
