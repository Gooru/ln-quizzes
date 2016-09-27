import Ember from 'ember';
import BuilderMixin from 'gooru-web/mixins/content/builder';

/**
 * Course content viewer: Accordion Course
 *
 * Component responsible for listing a set of units
 *
 * @module
 * @augments Ember/Component
 * @mixes mixins/content/builder
 */
export default Ember.Component.extend(BuilderMixin, {


  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'courses', 'gru-accordion-course', 'gru-accordion'],


  // -------------------------------------------------------------------------
  // Actions

  actions: {

    closeAllUnits: function () {
      this.get('items').forEach(function (builderItem) {
        builderItem.set('isExpanded', false);
      });
    }

  }

});
