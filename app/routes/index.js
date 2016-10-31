import Ember from 'ember';
import Env from '../config/environment';
import PublicRouteMixin from "quizzes/mixins/public-route-mixin";

/**
 * @typedef {object} Index Route
 */
export default Ember.Route.extend(PublicRouteMixin, {

  session: Ember.inject.service(),

  sessionService: Ember.inject.service("api-sdk/session"),

  queryParams: {
    access_token : {}
  },

  model(params) {
    const route = this;
    let details = null;
    let accessToken = params.access_token;
    if (accessToken) { // this is for google sign in
      details = this.get("sessionService").signInWithToken(accessToken)
        .then(function() {
          return route.controllerFor('application').loadUserClasses();
        });
    }
    return details;
  },

  afterModel() {
    const anonymous = this.get('session.isAnonymous');
    if (!anonymous) {
      if (this.get('session.userData.isNew')) {
        this.transitionTo('sign-up-finish');
      } else {
        this.transitionTo('home');
      }
    }
  }

});
