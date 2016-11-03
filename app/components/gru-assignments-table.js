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

  classNames: ['gru-assignments-table'],


  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /***
     * Search assignment
     */
    selectAssignment: function (assignment) {
      this.selectAssignment(assignment);
      this.sendAction('onSelectAssignment',assignment);
    },
    /**
     * Sort assignment list
     */
    sortBy:function(criteria){
      if(criteria===this.get('sortBy')){
        this.set('reverseSort',!this.get('reverseSort'));
      }else{
        this.set('sortBy',criteria);
        this.set('reverseSort',false);
      }
    }
  },
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
   * @property {Number} the calculated resource content table height
   */
  calculatedTableContentHeight: null,
  /**
   *Return the table content height to print on inline styles
   */
  tableContentHeight: Ember.computed('calculatedTableContentHeight',function(){
    var height = this.get('calculatedTableContentHeight');
    const heightString = height > 0 ? `${height}px` : '100%';
    return new Ember.Handlebars.SafeString(`max-height: ${heightString}`);
  }),
  // -------------------------------------------------------------------------
  // Methods
  /**
   *Calculate the height of the content
   */
  calculateHeight:function(){
    var contentHeight = $(window).outerHeight(true);
    this.set('calculatedTableContentHeight', contentHeight);
  },
  /**
   * Set assignment as selected
   */
  selectAssignment:function(assignment){
    this.unSelectAssignment();
    assignment.set('selected',true);
  },
  /**
   * Unselected assignment
   */
  unSelectAssignment:function(){
    var selectedAssignment = this.get('assignments').findBy('selected',true);
    if(selectedAssignment){
      selectedAssignment.set('selected',false);
    }
  }
});
