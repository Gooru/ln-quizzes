import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview, {
  location: config.locationType
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

  this.route('content', function () {

    this.route('assessments', function () {
      this.route('edit', {path: '/edit/:assessmentId'});
    });

    this.route('collections', function () {
      this.route('edit', {path: '/edit/:collectionId'});
    });

    this.route('courses', function () {
      this.route('edit', {path: '/edit/:courseId'});
      this.route('play', {path: '/play/:courseId'});
    });

    this.route('classes', function() {
      this.route('create');
      this.route('join');
    });

    this.route('resources', function () {
      this.route('edit', {path: '/edit/:resourceId'});
      this.route('play', {path: '/play/:resourceId'});
    });

    this.route('questions', function () {
      this.route('edit', {path: '/edit/:questionId'});
      this.route('play', {path: '/play/:questionId'});
    });
  });

  this.route('player', { path: '/player/:contextId'});

  this.route('context-player', {path: '/player/class/:classId/course/:courseId/unit/:unitId/lesson/:lessonId/collection/:collectionId'});

  this.route('classes');

  this.route('class', { path: '/class/:classId' }, function() {
    this.route('overview');
    this.route('info');
    this.route('quick-start');
    this.route('edit');

    this.route('analytics', function() {
      this.route('performance', function() {
        this.route('student');
        this.route('teacher', function() {
          this.route('course');
          this.route('unit', { path: '/unit/:unitId'});
          this.route('lesson', { path: '/unit/:unitId/lesson/:lessonId'});
          this.route('collection', { path: '/unit/:unitId/lesson/:lessonId/collection/:collectionId'});
        });
      });
    });

  });


  this.route('reports', function () {
    this.route('collection', {path: '/class/:classId/collection/:collectionId'});
    this.route('student-collection');
  });


  this.route('home');

  this.route('featured');

  this.route('account-settings', { path: '/account-settings/:userId' });

  this.route('integration', { path: '/integration/:appType'});

  this.route('profile', { path: '/:userId' }, function() {
    this.route('about');
    this.route('edit');
    this.route('activity');
    this.route('analytics');

    this.route('content', function() {
      this.route('courses');
      this.route('resources');
      this.route('questions');
      this.route('collections');
      this.route('assessments');
    });

    this.route('network', function() {
      this.route('following');
      this.route('followers');
    });
  });
});

export default Router;
