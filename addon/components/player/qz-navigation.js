import Ember from 'ember';

/**
 * Player navigation
 *
 * Component responsible for showing simple navigation controls (i.e. back/next)
 * for the player. It may embed other components for interacting with the player.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-navigation'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user open de navigator panel
     */
    openNavigator: function() {
      this.sendAction('onOpenNavigator');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if changes can be made
   * @property {boolean} readOnly
   */
  readOnly: false,

  /**
   * @property {Collection
   */
  collection: null

  // -------------------------------------------------------------------------
  // Methods
});
