import DS from 'ember-data';
import EndPointsConfig from 'quizzes/utils/endpoint-config';

export default DS.RESTAdapter.extend({

  /**
   * This custom implementation removes the default pluralization of the type
   */
  pathForType: function() {
    return '';
  },

  /**
   * Customizing ajax calls
   * @param url
   * @param method
   * @param hash
   * @returns {*}
   */
  ajax: function(url, method, hash) {
    const endpointUrl = EndPointsConfig.getEndpointUrl();
    return this._super(`${endpointUrl}${url}`, method, hash);
  }

});
