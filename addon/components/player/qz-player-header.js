import Ember from 'ember';

/**
 * Default Player header
 *
 * Component responsible for showing an informative header for the  player.
 * It may embed other components for interacting with the player.
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

  classNames: ['qz-player-header'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
    * Action triggered when the user closes the content player
    */
    closePlayer: function() {
      this.sendAction('onClosePlayer');
    },

    /**
     * Action triggered to remix the collection
     * @param content
     */
    remixCollection: function() {
      this.sendAction('onRemixCollection');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {collection} collection - The current Collection
   */
  collection: null

  // -------------------------------------------------------------------------
  // Methods
});
