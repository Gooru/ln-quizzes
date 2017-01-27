import Ember from 'ember';

export default Ember.Mixin.create({

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {ConfigurationService} configurationService
   * @property {Ember.Service} Service to retrieve configuration
   */
  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {String} token access token used for authorization on ajax requests
   */
  token: Ember.computed.alias('configurationService.configuration.properties.token')

});
