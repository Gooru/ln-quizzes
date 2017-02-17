import Ember from 'ember';
/**
 * Questions information component
 *
 * Component responsible for display the question performance information
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'gru-question-information'],



  // -------------------------------------------------------------------------
  // Properties
  /**
   * @prop { Question} question - Question to display
   */
  question: null,

  /**
   * @property {string} Return the question body and modified the text if the question is
   * FIB to show the correct format.
   */
  questionBody:Ember.computed('question.body',function(){
    let component = this;
    let text = this.get('question.body');

    if(component.get('question.isFIB')){
      let regex = /\[]/g;
      text = component.get('question.body').replace(regex, '_______');
    }
    return text;
  }),

  /**
   * @prop { String[]} hints - Question hints
   */
  hints: Ember.computed('question.hints',function(){
    return this.get('question.hints');
  }),

  /**
   * @prop { String[]} explanation - Question explanation
   */
  explanation: Ember.computed('question.explanation',function(){
    return this.get('question.explanation');
  }),
  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: null

});
