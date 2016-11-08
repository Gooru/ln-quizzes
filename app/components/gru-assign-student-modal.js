import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assign-student-modal'],

  actions:{
    /**
     * Close Modal
     */
    closeModal: function() {
      this.triggerAction({ action: 'closeModal' });
    }
  }
});
