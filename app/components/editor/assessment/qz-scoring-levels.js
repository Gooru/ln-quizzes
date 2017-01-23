import Ember from 'ember';
import Level from 'quizzes/models/editor/assessment/level';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor','assessment','qz-scoring-levels'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Level[]} ScoringLevels
   */
  scoringLevels:Ember.A([
    Level.create({
      id:'exemplary'
    }),
    Level.create({
      id:'proficient'
    }),
    Level.create({
      id:'basic'
    }),
    Level.create({
      id:'below-basic'
    })
  ])

});
