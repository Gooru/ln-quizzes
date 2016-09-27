import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    term: {
      refreshModel: true
    },
    sortOn:{
      refreshModel: true
    },
    order:{
      refreshModel: true
    }
  },

  setupController: function(controller) {
    controller.resetProperties();
    controller.get('parentController').selectMenuItem('content');
  },

  // -------------------------------------------------------------------------
  // Events
  resetController(controller) {
    var queryParams = controller.get('queryParams');
    queryParams.forEach(function (param) {
      if(param==="sortOn"){
        controller.set(param, 'updated_at');
      }else if(param==="order"){
        controller.set(param, 'desc');
      }else{
        controller.set(param, null);
      }
    });
  }

});
