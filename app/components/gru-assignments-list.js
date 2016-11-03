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

  classNames: ['gru-assignments-list'],
  // -------------------------------------------------------------------------
  // Actions
  actions:{
    /**
     * Select assignment
     */
    selectAssignment:function(assignment){
      this.set('selectedAssignment',assignment);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    const component = this;
    $('.gru-assignments-table tbody tr').each(function(){
      $(this).attr('data-search-term', $(this).find('td.title').text().toLowerCase());
    });
    $('.search-box').on('keyup', function(){
      component.searchAssignment();
    });

    component.calculateHeight();

    window.onresize = function() {
      component.calculateHeight();
    };
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * Selected assignment
   */
  selectedAssignment:null,

  /**
   * Assignments List
   */
  assignments:null,
  /**
   * Sort order
   */
  reverseSort: false, // default sort in ascending order
  /**
   * Sort criteria
   */
  sortBy: 'assignedDate', // default sort by assigned date
  /**
   * Assignments sorted by criteria
   */
  sortedAssignments: Ember.computed.sort('assignments', 'sortDefinition'),

  /**
   * @property {Number} the calculated resource content table height
   */
  calculatedTableContentHeight: null,

  /**
   * Sort definition
   */
  sortDefinition: Ember.computed('sortBy','reverseSort', function() {
    let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
    return [ `${this.get('sortBy')}:${sortOrder}` ];
  }),
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
   * Filter assignment by title
   */
  searchAssignment:function(){
    var searchTerm = $('.search-box').val().toLowerCase();

    $('.gru-assignments-table tbody tr').each(function(){
      if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
});
