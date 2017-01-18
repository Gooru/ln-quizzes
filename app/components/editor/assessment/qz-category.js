import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor','assessment','qz-category'],

  // -------------------------------------------------------------------------
  // Properties
  category:Ember.Object.create({
    title:'',
    feedbackGuidance:'',
    requiredFeedback:false
  }),
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
