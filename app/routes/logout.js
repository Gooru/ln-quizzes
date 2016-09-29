import Ember from "ember";
import PrivateRouteMixin from "quizzes/mixins/private-route-mixin";
import Env from 'quizzes/config/environment';

export default Ember.Route.extend(PrivateRouteMixin, {

  /**
   * @property {Service} session
   */
  session: Ember.inject.service(),


  beforeModel: function() {
    this._super(...arguments);
    this.get("session").invalidate();
    const isProd = Env.environment === 'production';
    if (isProd) {
      window.location = Env.marketingSiteUrl; //this is not an ember route, see nginx.conf
      return true;
    }
  }

});
