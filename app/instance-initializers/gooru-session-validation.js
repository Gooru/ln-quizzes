import Ember from 'ember';

export function initialize() {

  Ember.$(document).ajaxError(function() {
    // No session validation for now
  });
}

export default {
  name: 'gooru-session-validation',
  after: 'gooru-session-service',
  initialize: initialize
};
