import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-detail'],

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    const component = this;

    component.calculateHeight();

    window.onresize = function() {
      component.calculateHeight();
    };
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Assignment to show
   */
  assignment:null,

  /**
   * @property {Number} the calculated resource content table height
   */
  calculatedContentHeight: null,
  /**
   *Indicate if the assignment has attempts left
   */
  hasAttempts:Ember.computed('assignment.attempts','assignment.totalAttempts',function(){
    return this.get('assignment.totalAttempts') - this.get('assignment.attempts') > 0;
  }),
  /**
   *Return the table content height to print on inline styles
   */
  contentHeight: Ember.computed('calculatedContentHeight',function(){
    var height = this.get('calculatedContentHeight');
    const heightString = height > 0 && height >= 400 ? `${height}px` : '100%';
    return new Ember.Handlebars.SafeString(`max-height: ${heightString}`);
  }),
  // -------------------------------------------------------------------------
  // Methods
  /**
   *Calculate the height of the content
   */
  calculateHeight:function(){
    var contentHeight = $('.ember-view').parent().outerHeight(true) - $('.table-fixed thead ').height() - $('.search').height();
    this.set('calculatedContentHeight', contentHeight);
  }

});
