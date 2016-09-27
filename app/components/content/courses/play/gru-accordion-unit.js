import Ember from 'ember';
import BuilderItem from 'gooru-web/models/content/builder/item';
import BuilderMixin from 'gooru-web/mixins/content/builder';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';

/**
 * Course content viewer: Accordion Unit
 *
 * Component responsible for behaving as an accordion and listing a set of lessons.
 * It is meant to be used inside of an {@link ./gru-accordion-course|Accordion Course}
 *
 * @module
 * @augments Ember/Component
 * @mixes mixins/content/builder
 */
export default Ember.Component.extend(BuilderMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:api-sdk/unit
   */
  unitService: Ember.inject.service("api-sdk/unit"),


  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'courses', 'gru-accordion', 'gru-accordion-unit'],

  classNameBindings: ['model.isEditing:edit:view'],

  tagName: 'li',

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    toggle: function () {
      var toggleValue = !this.get('model.isExpanded');

      this.loadData();
      this.get('onExpandUnit')();
      this.set('model.isExpanded', toggleValue);
    }

  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {String} course - Course this unit belongs to
   */
  course: null,

  /**
   * @prop {Boolean} isLoaded - Has the data for the unit already been loaded
   */
  isLoaded: false,

  /**
   * @prop {Content/Unit} unit
   */
  unit: Ember.computed.alias('model.data'),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('unit.taxonomy.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("unit.taxonomy"), false);
  }),


  // -------------------------------------------------------------------------
  // Methods

  /**
   * Load data for the unit
   *
   * @function actions:loadData
   * @returns {undefined}
   */
  loadData: function () {
    if (!this.get('isLoaded')) {
      let courseId = this.get('course.id');
      let unitId = this.get('unit.id');

      return this.get('unitService')
        .fetchById(courseId, unitId)
        .then(function (unit) {
          this.set('model.data', unit);

          // Wrap every lesson inside of a builder item
          var children = unit.get('children').map(function (lesson) {
            return BuilderItem.create({
              data: lesson
            });
          });
          this.set('items', children);
          this.set('isLoaded', true);
        }.bind(this))

        .catch(function (error) {
          var message = this.get('i18n').t('common.errors.unit-not-loaded').string;
          this.get('notifications').error(message);
          Ember.Logger.error(error);
        }.bind(this));
    } else {
      return Ember.RSVP.resolve(true);
    }
  }
});
