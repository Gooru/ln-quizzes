import Ember from 'ember';

/**
 * Teacher Analytics Performance Route
 *
 * Route responsible of the transitions and loading the model/data for the teacher class performance
 *
 * @module
 * @augments ember/Controller
 */
export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Dependencies


  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Triggered when the breadcrumb item is selected
     * @param {*} item
     */
    selectBreadcrumbItem: function(item){
      const type = item.get('value').type;
      const itemId = item.get('value').id;
      const breadcrumbLink = 'class.analytics.performance.teacher.' + type;

      if (type === 'course') {
        this.transitionTo(breadcrumbLink);
      }
      else if (type === 'unit') {
        this.transitionTo(breadcrumbLink, itemId);
      }
      else {
        const unitId = this.get("controller.unit").get('id');
        this.transitionTo(breadcrumbLink, unitId , itemId);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Set all controller properties from the model
   * @param controller
   */
  setupController: function(controller) {
    controller.updateBreadcrumb(controller.get("course"), "course");
    controller.get('classController').selectMenuItem('analytics.performance');
    this.setupDataPickerOptions(controller);
  },

  /**
   * Setups data picker options
   * @param controller
   */
  setupDataPickerOptions: function(controller){
    //setting data picker configuration for desktop
    const optionsTeacher = Ember.A([Ember.Object.create({
      'value': 'score',
      'selected':true,
      'readOnly':true
    }),Ember.Object.create({
      'value': 'completion',
      'selected':false,
      'readOnly':false
    }),Ember.Object.create({
      'value': 'study-time',
      'selected':false,
      'readOnly':false
    })]);
    controller.set("optionsTeacher", optionsTeacher);

    //setting data picker configuration for mobile
    const mobileOptionsTeacher = Ember.A([Ember.Object.create({
      'value': 'score',
      'selected':true,
      'readOnly':false
    }),Ember.Object.create({
      'value': 'completion',
      'selected':false,
      'readOnly':false
    }),Ember.Object.create({
      'value': 'study-time',
      'selected':false,
      'readOnly':false
    })]);
    controller.set("mobileOptionsTeacher", mobileOptionsTeacher);

  }
});
