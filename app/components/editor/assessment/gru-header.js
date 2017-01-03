import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['header', 'assessment', 'edit'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    select: function(value) {
      this.set('selected', value);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  selected: 'information'

});
