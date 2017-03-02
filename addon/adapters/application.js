import Ember from 'ember';
import EndPointsConfig from 'quizzes-addon/utils/endpoint-config';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({

  namespace: '/config',

  /**
   * Gets custom configuration
   * @returns {Promise.<[]>}
   */
  sendAjaxRequest: function (url, options) {
    console.log(1, url, options)
    options.beforeSend = function(jqXHR, settings) {
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
    };
    return Ember.$.ajax(url, options);
  }
});
