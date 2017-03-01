import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames:['qz-player-confirmation'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    start(){
      this.get('router').transitionTo('player', this.get('context.id'));
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {[string]} currentAttempts
   */
  attempts: null,

  attemptsLeft: Ember.computed('attempts','collection.attempts',function(){
      return this.get('collection.attempts') - this.get('attempts');
    }
  ),

  /**
   * @property {Collection} collection
   */
  collection: null,

  /**
   * @property {Context} context
   */
  context:null,

  /**
   * @property {boolean} flag for determining button behaviour
   */
  disableStart: Ember.computed('unlimited', 'noMoreAttempts', function(){
    return !this.get('unlimited') && this.get('noMoreAttempts');
  }),

  /**
   * @property {Boolean} Indicate if the context has more attempts available
   */
  noMoreAttempts: Ember.computed('collection.isAssessment','collection.attempts','attempts',function(){
    return (this.get('collection.isAssessment') && this.get('collection.attempts') > 0
    && this.get('attempts') && this.get('attempts.length') >= this.get('collection.attempts'));
  }),
  /**
   * @property {boolean} flag for determining unlimited behaviour
   */
  unlimited: Ember.computed.equal('collection.attempts', -1)

});
