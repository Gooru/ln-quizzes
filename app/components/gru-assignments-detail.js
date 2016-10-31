import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-detail'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Assignment to show
   */
  assignment:null,
  /**
   *Indicate if the assignment has attempts left
   */
  hasAttempts:Ember.computed('assignment.attempts','assignment.totalAttempts',function(){
    return this.get('assignment.totalAttempts') - this.get('assignment.attempts') > 0;
  })

});
