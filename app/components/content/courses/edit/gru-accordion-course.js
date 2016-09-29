import Ember from 'ember';
import BuilderItem from 'quizzes/models/content/builder/item';
import Unit from 'quizzes/models/content/unit';
import PlayerAccordionCourse from 'quizzes/components/content/courses/play/gru-accordion-course';

/**
 * Content Builder: Accordion Course
 *
 * Component responsible for listing a set of units
 *
 * @module
 * @augments /components/content/courses/play/gru-accordion-course
 *
 */
export default PlayerAccordionCourse.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @requires service:api-sdk/unit
   */
  courseService: Ember.inject.service("api-sdk/course"),


  // -------------------------------------------------------------------------
  // Actions

  actions: {

    addUnit: function () {
      var unit = Unit.create(Ember.getOwner(this).ownerInjection(), {
        title: null
      });
      var builderItem = BuilderItem.create({
        isEditing: true,
        data: unit
      });
      // Close all units before presenting the form for the new unit
      this.actions.closeAllUnits.apply(this);
      this.get('items').pushObject(builderItem);
    },

    cancelAddUnit: function (builderItem) {
      this.get('items').removeObject(builderItem);
      builderItem.destroy();
    },

    removeUnit: function (builderItem) {
      this.get('items').removeObject(builderItem);
    },

    remixUnit: function (unit) {
      var builderItem = BuilderItem.create({
        isEditing: false,
        data: unit
      });
      this.actions.closeAllUnits.apply(this);
      this.get('items').pushObject(builderItem);
    },

    sortUnits: function() {
      var items = this.get('items');
      items.forEach(function(item) {
        item.set('isExpanded', false);
      });
      this.actions.sortItems.call(this);
    },

    saveUnitsOrder: function() {
      var courseId = this.get('model.id');
      var orderList = this.get('orderList');

      if (orderList && orderList.length > 1) {
        this.get('courseService').reorderCourse(courseId, orderList)
          .then(function(){
            this.actions.finishSort.call(this);
          }.bind(this));
      } else {
        this.actions.finishSort.call(this);
      }
    }

  },

  // -------------------------------------------------------------------------
  // Events

  didRender(){
    $('[data-toggle="tooltip"]').tooltip();
  }

});
