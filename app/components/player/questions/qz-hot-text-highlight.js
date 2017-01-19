import Ember from 'ember';
import QuestionComponent from './qz-question';

/**
 * Hot Text Highlight
 *
 * Component responsible for controlling the logic and appearance of a hot
 * text question inside of the {@link player/qz-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-hot-text-highlight'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Select or unselect an item
     * @param {{index: number, text: string, selected: boolean}} item
     */
    markItem: function(item) {
      const component = this;
      if (!component.get('readOnly')){
        item.set('selected', !item.get('selected'));
        component.notifyEvents(component.getSelectedItems(), false);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  /**
   * Generate items from question answer choices
   */
  initItems: function() {
    const component = this;
    component.generateItems();
    if(component.get('hasUserAnswer')) {
      component.notifyEvents(component.getSelectedItems(), true);
    }
  }.on('didInsertElement'),


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {{index: number, text: string}} items
   */
  items: null,

  // -------------------------------------------------------------------------
  // Observers

  /**
   * Refresh items when the question changes
   */
  refreshItems: Ember.observer('question.id', function() {
    this.generateItems();
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Generate phrase items from the first question answer text
   * It handle word and sentence variants, and it sets the 'items' component property accordingly
   */
  generateItems: function() {
    const component = this;
    const util = component.get('questionUtil');
    let items = util.getItems();
    if (component.get('hasUserAnswer')) {
      let userAnswer = component.get('userAnswer');
      items.forEach(function(item){
        let selected = userAnswer.findBy('index', item.get('index'));
        item.set('selected', selected !== undefined);
      });
    }
    component.set('items', items);
  },

  /**
   * Returns those items selected by the user
   * @returns {{index: number, text: string, selected: boolean}[]} selected items
   */
  getSelectedItems: function() {
    return this.get('items').filterBy('selected', true);
  },

  /**
   * Notifies events based on selected items
   * @param {{index: number, text: string, selected: boolean}} selectedItems
   * @param {boolean} onLoad if this was called when loading the component
   */
  notifyEvents: function(selectedItems, onLoad) {
    const component = this;
    const userAnswer = selectedItems.map(function(item) {
      return { index: item.get('index'), text: item.get('text') };
    });

    component.notifyAnswerChanged(userAnswer);
    if (selectedItems.get('length')) {
      if(onLoad) {
        component.notifyAnswerLoaded(userAnswer);
      } else {
        component.notifyAnswerCompleted(userAnswer);
      }
    } else {
      component.notifyAnswerCleared(userAnswer);
    }
  }

});
