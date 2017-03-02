import ConfigurationService from 'quizzes-addon/services/quizzes/configuration';
import ContextService from 'quizzes-addon/services/quizzes/api-sdk/context';
import CollectionService from 'quizzes-addon/services/quizzes/api-sdk/collection';
import ProfileService from 'quizzes-addon/services/quizzes/api-sdk/profile';

export default {
  name: 'quizzes-services',
  initialize: function(application) {
    application.register('service:quizzes/configuration', ConfigurationService);
    application.register('service:quizzes/context', ContextService);
    application.register('service:quizzes/collection', CollectionService);
    application.register('service:quizzes/profile', ProfileService);
  }
};
