import Ember from 'ember';
import PrivateRouteMixin from "quizzes/mixins/private-route-mixin";

export default Ember.Route.extend(PrivateRouteMixin, {

  /**
   * Before leaving the route
   */
  deactivate: function() {
    this.controller.set('isLoading', false);
  }
});

