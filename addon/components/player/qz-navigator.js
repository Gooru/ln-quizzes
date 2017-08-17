import Ember from 'ember';
import ModalMixin from 'quizzes-addon/mixins/modal';

/**
 * Player navigator
 *
 * Component responsible for enabling more flexible navigation options for the player.
 * For example, where {@link player/qz-navigation.js}} allows selecting only
 * the previous or the next content item, the navigator allows navigation to
 * any of the content items available.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend(ModalMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames:['qz-navigator'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered to remix the collection
     * @param content
     */
    remixCollection:function(){
       this.sendAction('onRemixCollection');
    },
    /**
     * Action triggered when the user closes the content player
     */
    closePlayer:function(){
      this.sendAction('onClosePlayer');
    },

    /**
     * Action triggered when the user close de navigator panel
     */
    closeNavigator: function() {
      this.sendAction('onCloseNavigator');
    },

    /**
     * Action triggered when the user wants to finish the collection
     */
    finishCollection: function() {
      this.sendAction('onFinishCollection');
    },

    /**
     * Action triggered when the user clicks at see usage report
     */
    seeUsageReport: function() {
      this.sendAction('onFinishCollection');
    },

    /**
     *
     * Triggered when an item is selected
     * @param item
     */
    selectItem: function(item) {
      this.selectItem(item.resource);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * Should resource links in the navigator be disabled?
   * @property {boolean}
   */
  isNavigationDisabled: false,

  /**
   * @property {string} on finish collection, having type = 'collection'
   */
  onFinishCollection: null,

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),
  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not('isStudent'),
   /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  showRemix: Ember.computed.and('showBackButton', 'isTeacher'),
  /**
   * @property {string|function} onItemSelected - event handler for when an item is selected
   */
  onItemSelected: null,

  /**
   * @property {string} on content player close action
   */
  onClosePlayer: null,
    /**
   * @property {string} on content player remix action
   */
  onRemixCollection:null,

  /**
   * A convenient structure to render the menu
   * @property
   */
  resourceItems: Ember.computed('collection', 'resourceResults.@each.value', 'selectedResourceId','showFinishConfirmation', function(){
    let component = this;
    let collection = component.get('collection');
    let resourceResults = component.get('resourceResults');
    return resourceResults.map(function(resourceResult) {
      let resourceId = resourceResult.get('resource.id');
      return {
        resource: collection.getResourceById(resourceId),
        started: resourceResult.get('started'),
        isCorrect: resourceResult.get('isCorrect'),
        selected: resourceId === component.get('selectedResourceId')
      };
    });
  }),

  /**
   * Resource result for the selected resource
   * @property {ResourceResult}
   */
  resourceResults: Ember.A([]),

  /**
   * @property {String} if the back link is shown
   */
  showBackButton: true,

  /**
   * @property {String} selectedResourceId - resource Id selected
   */
  selectedResourceId: null,

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Triggered when a resource item is selected
   * @param {Resource} resource
   */
  selectItem: function(resource) {
    if (resource && !this.get('isNavigationDisabled')) {
      if (this.get('onItemSelected')){
        this.sendAction('onItemSelected', resource);
      }
      this.sendAction('onCloseNavigator');
    }
  }
});
