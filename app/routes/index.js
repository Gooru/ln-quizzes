import Ember from 'ember';
import Env from '../config/environment';
import PublicRouteMixin from "gooru-web/mixins/public-route-mixin";

/**
 * @typedef {object} Index Route
 */
export default Ember.Route.extend(PublicRouteMixin, {

  session: Ember.inject.service(),

  sessionService: Ember.inject.service("api-sdk/session"),

  queryParams: {
    access_token : {}
  },

  beforeModel(transition) {
    const route = this;
    return this._super(...arguments).then(function(){
      let anonymous = route.get("session.isAnonymous");
      let isProd = Env.environment === 'production';
      let url = route.get("router.url");
      let googleSignIn = url.indexOf("access_token") > 0; //if it has the access_token parameter
      if (anonymous && !googleSignIn && isProd) {
        transition.abort();
        window.location.href += Env.marketingSiteUrl; //this is not an ember route, see nginx.conf
      }
    });
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
