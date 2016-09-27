import Ember from 'ember';
import PublicRouteMixin from 'gooru-web/mixins/public-route-mixin';

export default Ember.Route.extend(PublicRouteMixin, {
  authSvc: Ember.inject.service("api-sdk/authentication"),
  session: Ember.inject.service(),
  sessionSvc: Ember.inject.service("api-sdk/session"),

  model(params){
    return Ember.RSVP.hash({
      appType:params.appType,
      token:params.token,
      classId:params.classId,
      page:params.page
    });

  },
  redirect(model) {
    let route = this;
    if (model.appType=== 'teams') {
      let authPromise = this.get('authSvc').checkToken(model.token).then(
          result => result && this.get('sessionSvc').signInWithToken(model.token)
        );
        authPromise.then(
          () => route.transitionTo(route.getRoute(model.page),model.classId),
          () => route.transitionTo('sign-in')
        );
    }
  },

  getRoute(page){
    var routes = {
      'info':'class.info',
      'data':'class.analytics.performance',
      'course-map':'class.overview'
    };
    return routes[page];
  }

});
