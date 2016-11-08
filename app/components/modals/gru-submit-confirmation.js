import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['modals', 'gru-submit-confirmation'],

  classNameBindings: ['component-class'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * When the submission is confirmed
     */
    confirm: function() {
      this.get('model').onConfirm().then(
        this.get('closeModal').bind(this)
      );
    },

    /**
     * When the submission is cancelled
     */
    cancel: function() {
      this.get('closeModal').call(this);
    }

  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * close the confirmation modal
   */
  closeModal: function () {
    const component = this;
    component.triggerAction({
      action: component.get('onCloseModal')
    });
  }
});
