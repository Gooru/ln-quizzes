import Ember from 'ember';

/**
 *
 * Controller for add/edit assessment
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Controller.extend({

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Object[]} headerActions List of action buttons to show
   */
  headerActions: Ember.computed(function(){
    return [{
      name: 'delete',
      text: this.get('i18n').t('common.delete'),
      icon: 'delete'
    }, {
      name: 'copy',
      text: this.get('i18n').t('common.copy'),
      icon: 'content_copy'
    }, {
      name: 'preview',
      text: this.get('i18n').t('common.preview'),
      icon: 'remove_red_eye'
    }, {
      name: 'settings',
      text: this.get('i18n').t('common.settings'),
      icon: 'settings'
    }, {
      name: 'assign',
      text: this.get('i18n').t('common.assign-to-class'),
      icon: 'person_add'
    }];
  }),

  /**
   * @property {String} headerTitle
   */
  headerTitle: Ember.computed(function() {
    return this.get('i18n').t('common.add-assessment');
  }),

  /**
   * @property {Object[]} options List of tab options to show
   */
  options: Ember.computed(function(){
    return [{
      name: 'editor',
      text: this.get('i18n').t('common.editor')
    }, {
      name: 'information',
      text: this.get('i18n').t('common.information')
    }];
  }),


  /**
   * @property {String} selected Current option selected
   */
  selected: 'editor'
});
