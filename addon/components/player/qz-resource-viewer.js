import Ember from 'ember';
import { RESOURCE_COMPONENT_MAP } from 'quizzes-addon/config/quizzes-config';

/**
 * Player question viewer
 *
 * Component responsible for providing a frame where all question types
 * will be displayed i.e. it will be responsible for selecting any specific
 * question components per question type.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['qz-resource-viewer'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when the next button is clicked
     */
    next: function(){
      this.set('isNextDisabled', true);
      /* TODO: Add call quizzes's onResource event */
      this.sendAction('onNext');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    this.setNarrationEffect();
    this.calculateResourceContentHeight();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * The collection playing
   * @property {Collection} collection
   */
  collection: null,

  /**
   * Disable next button
   * @property {Boolean} sendEvents
   */
  isNextDisabled: false,

  /**
   * Indicates if the current resource type is a link out
   * @property {boolean}
   */
  isNotIframeUrl: Ember.computed('resource', function(){
    const resource = this.get('resource');
    return (resource && resource.displayGuide);
  }),

  /**
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * The resource component selected
   * @property {string}
   */
  resourceComponentSelected: Ember.computed('resource.id', function () {
    const resourceType = (this.get('resource.isImageResource') ? 'image' : this.get('resource.resourceType'));
    var component = RESOURCE_COMPONENT_MAP[resourceType];

    if (!component) {
      Ember.Logger.error(`Resources of type ${resourceType} are currently not supported`);
    } else {
      Ember.Logger.debug('Resources component selected: ', component);
      return component;
    }
  }),

  /**
   * Show the next button and send events
   * @property {Boolean} sendEvents
   */
  sendEvents: false,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Observes for the resource change
   */
  resourceObserver: function() {
    this.calculateResourceContentHeight();
  }.observes('resource.id'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Calculates the height of the content area (it will change depending on height
   * of the narration -if there is one)
   */
  calculateResourceContentHeight: function() {
    if (this.get('resource.isUrlResource') ||
        this.get('resource.isPDFResource') ||
        this.get('resource.isImageResource') &&
        this.get('isNotIframeUrl') === false) {
      var narrationHeight = this.$('.narration').innerHeight();
      var contentHeight = $('.qz-content').height();

      // The 4 pixels subtracted are to make sure no scroll bar will appear for the content
      // (Users should rely on the iframe scroll bar instead)
      this.set('calculatedResourceContentHeight', contentHeight - narrationHeight - 4);
    }
  },
  /**
   * Set jquery effect to narration
   * */
  setNarrationEffect: function () {
    $('.narration').effect('highlight',{ color:  '#84B7DD'}, 2000);
  }
});
