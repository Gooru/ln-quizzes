import Ember from 'ember';
import EndPointsConfig from 'quizzes/utils/endpoint-config';

export default {
  name: 'ajax',
  after: 'gooru-configuration',
  initialize: function(/* app */) {
    Ember.$.ajaxSetup({
      cache: false,
      crossDomain: true,
      beforeSend: function(jqXHR, settings) {
        const url = settings.url;
        if (url.startsWith('/')) {
          if (url.startsWith(EndPointsConfig.getRealTimeWebServiceUri()) || url.startsWith(EndPointsConfig.getRealTimeWebSocketUri())) {
            const realTimeUrl = EndPointsConfig.getRealTimeWebServiceUrl();
            settings.url = `${realTimeUrl}${url}`;
          } if (url.startsWith('/quizzes')) {
            const endpointUrl = EndPointsConfig.getEndpointUrl();
            settings.url = `${endpointUrl}${url}`;
          } else {
            const endpointUrl = EndPointsConfig.getEndpointProviderUrl();
            settings.url = `${endpointUrl}${url}`;
          }
        }
      }
    });
  }
};
