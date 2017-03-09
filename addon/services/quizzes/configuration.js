import Ember from 'ember';
import ConfigurationAdapter from 'quizzes-addon/adapters/configuration';
import DevelopmentConfiguration from 'quizzes-addon/config/env/development';
import TestConfiguration from 'quizzes-addon/config/env/test';
import ProductionConfiguration from 'quizzes-addon/config/env/production';

const ConfigurationService = Ember.Service.extend({

  configurationAdapter: null,

  configuration: null,

  init: function () {
    this._super(...arguments);
    this.set('configurationAdapter', ConfigurationAdapter.create(Ember.getOwner(this).ownerInjection()));
  },


  loadConfiguration: function() {
    const service = this;
    const environment = Ember.getOwner(this).resolveRegistration('config:environment').environment;
    const isProduction = environment === 'production';
    const isDevelopment = environment === 'development';
    const envConfiguration = isProduction ? ProductionConfiguration :
      (isDevelopment ? DevelopmentConfiguration : TestConfiguration);

    const configuration = Ember.Object.create(envConfiguration);
    service.set('configuration', configuration);

    //setting the configuration to the global variable
    ConfigurationService.configuration = configuration;

    const hostname = window.location.hostname;

    return service.get('configurationAdapter').loadConfiguration(`${hostname}-quizzes`)
      .then(function(hostnameConfiguration){ //it looks for the specific domain configuration
       if (hostnameConfiguration) {
         configuration.setProperties(hostnameConfiguration);
         Ember.Logger.info('Quizzes custom host configuration found: ', hostnameConfiguration);
       }
       return configuration;
    });
  },

  addProperties:function(properties){
    const service = this;
    service.set('configuration.properties',properties);
  },

  /**
   * Sets the token property
   * @param {string} token
   */
  setToken: function(token) {
    const service = this;
    service.set('configuration.properties.token', token);
  }
});

ConfigurationService.reopenClass({

  /**
   * Application configuration properties
   */
  configuration: null
});

export default ConfigurationService;
