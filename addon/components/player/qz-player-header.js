import Ember from 'ember';
import {
  PLAYER_EVENT_SOURCE,
  PLAYER_EVENT_MESSAGE
} from 'quizzes-addon/config/quizzes-config';

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
      let component = this;
      let isIframeMode = component.get('isIframeMode');
      let isEventFromRGO = component.get('isEventFromRGO');
      if (isEventFromRGO) {
        window.close();
      } else if (isIframeMode) {
        window.parent.postMessage(PLAYER_EVENT_MESSAGE.GRU_PUllUP_CLOSE, '*');
      } else {
        this.sendAction('onClosePlayer');
      }
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
  collection: null,

  /**
   * @property {isEventFromRGO}
   * To determine whether the player event was triggered from the RGO app
   */
  isEventFromRGO: Ember.computed('source', function() {
    let component = this;
    let source = component.get('source');
    return source === PLAYER_EVENT_SOURCE.RGO;
  })

  // -------------------------------------------------------------------------
  // Methods
});
