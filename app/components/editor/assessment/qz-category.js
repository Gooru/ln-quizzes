import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor','assessment','qz-category'],

  // -------------------------------------------------------------------------
  // Actions
  actions:{
    /**
     *Set if feedback is required
     */
    setFeedBack: function(){
      this.set('category.requiredFeedback',!this.get('category.requiredFeedback'));
    },
    /**
     *Triggered when scoring switch change
     */
    onScoringChange:function(isChecked){
      this.set('showScore',isChecked);
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  category:Ember.Object.create({
    title:'',
    feedbackGuidance:'',
    requiredFeedback:false
  }),

  number:1,
  /**
   *Show the score scale
   *
   * @property {Boolean}
   */
  showScore:false,
  /**
   * List of options to show in the switch
   *
   * @property {Array}
   */
  switchOptions:  Ember.A([Ember.Object.create({
    'label': 'On',
    'value': true
  }),Ember.Object.create({
    'label': 'Off',
    'value': false
  })])
});
