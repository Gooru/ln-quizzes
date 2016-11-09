import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend(googlePageview, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', {path: '/'});

  this.route('search', function() {
    this.route('collections');
    this.route('assessments');
    this.route('questions');
    this.route('resources');
  });

  this.route('sign-in');
  this.route('forgot-password');
  this.route('reset-password');
  this.route('sign-up');
  this.route('sign-up-finish');
  this.route('logout');

  this.route('player', { path: '/player/:contextId'});

  this.route('context-player', {path: '/player/class/:classId/course/:courseId/unit/:unitId/lesson/:lessonId/collection/:collectionId'});

  this.route('classes');

  this.route('reports', function () {
    this.route('collection', {path: '/class/:classId/collection/:collectionId'});
    this.route('student-collection');
  });


  this.route('home');

  this.route('featured');

  this.route('account-settings', { path: '/account-settings/:userId' });

  this.route('integration', { path: '/integration/:appType'});

  this.route('assign',{ path: '/assessment/:assessmentId'});
  this.route('assignments',{ path: '/profile/:profileId'});
});

export default Router;
