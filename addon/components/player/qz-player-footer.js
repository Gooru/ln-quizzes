import Ember from 'ember';
import { EMOTION_VALUES } from 'quizzes-addon/config/quizzes-config';

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

  classNames: ['qz-player-footer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user change the emotion
     * @see qz-emotion-picker
     */
    changeEmotion: function(emotionScore) {
      let component = this;
      let resource = component.get('resource');
      let unicode = component.selectedEmotionUnicode(emotionScore);
      component
        .$(`#resource-${resource.id}`)
        .find('svg use')
        .attr(
          'xlink:href',
          `/assets/quizzes-addon/emoji-one/emoji.svg#${unicode}`
        );
      this.sendAction('onChangeEmotion', emotionScore);
    },

    /**
     * Action triggered when the user open the navigator panel
     */
    onOpenNavigator: function() {
      let component = this;
      component.set('isNavigatorOpen', true);
      component.$('.list-resources').slideDown();
    },

    /**
     * Action triggered when the user close the navigator panel
     */
    onCloseNavigator: function() {
      let component = this;
      component.set('isNavigatorOpen', false);
      component.$('.list-resources').slideUp();
    },

    /**
     *
     * Triggered when an item is selected
     * @param item
     */
    selectItem: function(item) {
      this.selectItem(item.resource);
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

    /***
     * Return to previous resource
     * @param {Resource} question
     */
    previousResource: function() {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onPreviousResource', component.get('resource'));
    },

    /***
      * Return to previous resource
      * @param {Resource} question
      */
    nextResource: function() {
      const component = this;
      component.$('.content').scrollTop(0);
      component.sendAction('onNextResource', component.get('resource'));
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} on change emotion action
   */
  onChangeEmotion: 'onChangeEmotion',

  /**
   * @property {number} The rating score for the current resource
   */
  ratingScore: 0,

  /**
   * Indicates if changes can be made
   * @property {boolean} readOnly
   */
  readOnly: false,

  /**
   * @property {Collection}
   */
  collection: null,

  /**
   * @property {String} It will decided to show react widget or not
   */
  showReactButton: true,

  /**
   * @property {String} selectedResourceId - resource Id selected
   */
  selectedResourceId: null,

  /**
   * @property {string|function} onItemSelected - event handler for when an item is selected
   */
  onItemSelected: null,

  /**
   * Indicates when the collection is already submitted
   * @property {boolean}
   */
  submitted: false,

  /**
   * Resource result for the selected resource
   * @property {ResourceResult}
   */
  resourceResults: Ember.A([]),

  /**
   * A convenient structure to render the menu
   * @property
   */
  resourceItems: Ember.computed(
    'collection',
    'resourceResults.@each.value',
    'selectedResourceId',
    'showFinishConfirmation',
    function() {
      const component = this;
      const collection = component.get('collection');
      const resourceResults = component.get('resourceResults');
      return resourceResults.map(function(resourceResult) {
        const resourceId = resourceResult.get('resource.id');
        const ratingScore = resourceResult.get('reaction');
        return {
          resource: collection.getResourceById(resourceId),
          started: resourceResult.get('started'),
          isCorrect: resourceResult.get('isCorrect'),
          selected: resourceId === component.get('selectedResourceId'),
          unicode: component.selectedEmotionUnicode(ratingScore)
        };
      });
    }
  ),

  /**
   * Should resource links in the navigator be disabled?
   * @property {boolean}
   */
  isNavigationDisabled: false,

  /**
   * It will maintain the state of navigator pull up
   * @property {boolean}
   */
  isNavigatorOpen: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Triggered when a resource item is selected
   * @param {Resource} resource
   */
  selectItem: function(resource) {
    if (resource && !this.get('isNavigationDisabled')) {
      if (this.get('onItemSelected')) {
        this.sendAction('onItemSelected', resource);
      }
    }
  },

  /**
   * Find selected emotion unicode from rating score
   * @type {{String}}
   */
  selectedEmotionUnicode: function(ratingScore) {
    if (ratingScore) {
      let selectedEmotion = EMOTION_VALUES.findBy('value', ratingScore);
      return selectedEmotion.unicode;
    }
    return 'no-reaction';
  },

  /**
   *  @property {Object} Extracted the unit title from unit
   */
  unitTitle: Ember.computed(function() {
    let unit = this.get('unit');
    if (unit) {
      return Ember.Object.create({
        shortname: `U${unit.get('sequence')}`,
        fullname: unit.get('title')
      });
    }
    return null;
  }),

  /**
   *  @property {Object} Extracted the lesson title from lesson
   */
  lessonTitle: Ember.computed(function() {
    let lesson = this.get('lesson');
    if (lesson) {
      return Ember.Object.create({
        shortname: `L${lesson.get('sequence')}`,
        fullname: lesson.get('title')
      });
    }
    return null;
  }),

  /**
   *  @property {Object} Extracted the collection title from unit, lesson and/or collection
   */
  collectionTitle: Ember.computed(function() {
    let collection = this.get('collection');
    let lesson = this.get('lesson');
    let title = null;
    if (lesson) {
      let lessonChildren = lesson.children;
      let isChild = lessonChildren.findBy('id', collection.id);
      if (collection && isChild) {
        if (
          collection.isCollection === true ||
          collection.collectionType === 'collection'
        ) {
          let collections = lessonChildren.filter(
            collection => collection.format === 'collection'
          );
          collections.forEach((child, index) => {
            if (child.id === collection.id) {
              let collectionSequence = index + 1;
              title = Ember.Object.create({
                shortname: `C${collectionSequence}`,
                fullname: collection.get('title')
              });
            }
          });
        } else {
          let assessments = lessonChildren.filter(
            assessment => assessment.format === 'assessment'
          );
          assessments.forEach((child, index) => {
            if (child.id === collection.id) {
              let assessmentSequence = index + 1;
              title = Ember.Object.create({
                shortname: `A${assessmentSequence}`,
                fullname: collection.get('title')
              });
            }
          });
        }
      }
    }
    if (!title) {
      title = Ember.Object.create({
        shortname:
          collection.isCollection === true ||
          collection.collectionType === 'collection'
            ? 'C'
            : 'A',
        fullname: collection.get('title')
      });
    }

    return title;
  })
});
