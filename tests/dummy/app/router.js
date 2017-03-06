import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('player', { path: '/player/:contextId' });

  this.route('edit', function() {
    this.route('assessment', { path: '/assessment/:assessmentId' });
  });

  this.route('reports', function () {
    this.route('context', { path: '/context/:contextId' });
    this.route('student-context', { path: '/student-context/:contextId' });
  });
  this.route('assign', { path: '/assessment/:assessmentId' });
  this.route('assignments', { path: '/profile/:profileId' });
});

export default Router;
