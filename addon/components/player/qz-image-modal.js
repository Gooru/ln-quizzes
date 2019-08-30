import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';
export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-image-modal'],

  thumbnail: Ember.computed.alias('model.thumbnail'),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    closeModal: function() {
      this.set('modal.isVisible', false);
    }
  }
});
