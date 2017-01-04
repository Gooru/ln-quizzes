import Ember from 'ember';
import ConfigurationAdapter from 'quizzes/adapters/configuration';
import Env from 'quizzes/config/environment';
import DevelopmentConfiguration from 'quizzes/config/env/development';
import TestConfiguration from 'quizzes/config/env/test';
import ProductionConfiguration from 'quizzes/config/env/production';

const ConfigurationService = Ember.Service.extend({

  configurationAdapter: null,

  configuration: null,

  init: function () {
    this._super(...arguments);
    this.set('configurationAdapter', ConfigurationAdapter.create(Ember.getOwner(this).ownerInjection()));
  },


  loadConfiguration: function() {
    const service = this;
    const environment = Env.environment;
    const isProduction = environment === 'production';
    const isDevelopment = environment === 'development';
    const envConfiguration = isProduction ? ProductionConfiguration :
      (isDevelopment ? DevelopmentConfiguration : TestConfiguration);

    const configuration = Ember.Object.create(envConfiguration);
    service.set('configuration', configuration);

    //setting the configuration to the global variable
    ConfigurationService.configuration = configuration;

    const hostname = window.location.hostname;

    return service.get('configurationAdapter').loadConfiguration(hostname)
      .then(function(hostnameConfiguration){ //it looks for the specific domain configuration
       if (hostnameConfiguration) {
         configuration.setProperties(hostnameConfiguration);
         Ember.Logger.info('Custom host configuration found: ', hostnameConfiguration);
       }
       return configuration;
    });
  },

  addProperties:function(properties){
    const service = this;
    service.set('configuration.properties',properties);
  }
});

ConfigurationService.reopenClass({

  /**
   * Application configuration properties
   */
  configuration: null
});

export default ConfigurationService;
