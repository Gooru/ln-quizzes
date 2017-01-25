import Ember from 'ember';
import Category from 'quizzes/models/editor/assessment/category';

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
    onScoringChange: function(isChecked){
      this.set('showScore',isChecked);
    },
    /**
     *Delete a category
     */
    deleteCategory: function(category){
      this.sendAction('onDeleteCategory',category);
    },
    /**
     *Copy category
     */
    copyCategory: function (category,index) {
      this.sendAction('onCopyCategory',category,index);
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  category:Category.create({}),

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
