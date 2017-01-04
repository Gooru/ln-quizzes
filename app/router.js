import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend(googlePageview, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', {path: '/'});

  this.route('player', { path: '/player/:contextId' });
  this.route('edit', function() {
    this.route('assessment', { path: '/assessment/:assessmentId' });
  });

  this.route('reports', function () {
    this.route('context', { path: '/context/:contextId' });
  });

  this.route('integration', { path: '/integration/:appType' });

  this.route('assign', { path: '/assessment/:assessmentId' });
  this.route('assignments', { path: '/profile/:profileId' });
});

export default Router;
