import Ember from 'ember';

export function initialize(application) {
  const sessionService = application.lookup('service:session');
  const applicationRoute = application.container.lookup('route:application');

  Ember.$(document).ajaxError(function(event, jqXHR) {
    if(jqXHR.status === 401) {
      if(sessionService.session.isAnonymous) {
        sessionService.invalidate();
      } else {
        const queryParams = { queryParams: { sessionEnds: 'true' } };
        applicationRoute.transitionTo('sign-in', queryParams);
      }
    }
  });
}

export default {
  name: 'gooru-session-validation',
  after: 'gooru-session-service',
  initialize: initialize
};
