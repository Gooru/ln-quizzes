import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-submission-format'],

  // -------------------------------------------------------------------------
  // Actions


  actions: {

    selectType:function(type){
      this.set('selectedType',type);
    }
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {String} selectedType
   */
  selectedType: null,

  /**
   * @type {Array[]} questionTypes
   */
  submissionFormats: Ember.A([
    Ember.Object.create({
      format:'texbox'
    }),
    Ember.Object.create({
      format:'upload'
    })
  ])

});
