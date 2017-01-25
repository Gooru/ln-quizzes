import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor','assessment','qz-scoring-levels'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Level[]} ScoringLevels
   */
  scoringLevels:null

});
