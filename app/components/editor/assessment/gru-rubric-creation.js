import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor','assessment','gru-rubric-creation'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /***
     * Select tab option
     */
    selectOption: function (type) {
      this.set('showFromWeb', type === 'fromWeb');
      this.set('showFromComputer', type === 'fromComputer');
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates when then show from web option is visible
   * @property {boolean}
   */
  showFromWeb: true,

  /**
   * Indicates when show from computer is visible
   * @property {boolean}
   */
  showFromComputer: false
});
