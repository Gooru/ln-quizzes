import Ember from 'ember';
import {UPLOADABLE_TYPES} from 'quizzes/config/config';

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
  showFromComputer: false,

  /**
   * @type {String} list of all valid extension per quizzes/config/config#UPLOAD_TYPES
   */
  validExtensions: Ember.computed(function() {
    var extensions = UPLOADABLE_TYPES.map(typeObject => typeObject.validExtensions);
    return extensions.join(' ');
  })
});
