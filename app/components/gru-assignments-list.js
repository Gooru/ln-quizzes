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
   * Indicate if is a teacher view
   */
  isTeacher:false,
  /**
   * Sort order
   */
  reverseSort: false, // default sort in ascending order
  /**
   * Sort criteria
   */
  sortBy: Ember.computed('isTeacher',function(){
    return this.get('isTeacher') ? 'createdDate' : 'assignedDate';
  }),
  /**
   * Assignments sorted by criteria
   */
  sortedAssignments: Ember.computed.sort('assignments', 'sortDefinition'),

  /**
   * Sort definition
   */
  sortDefinition: Ember.computed('sortBy','reverseSort', function() {
    let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
    return [ `${this.get('sortBy')}:${sortOrder}` ];
  }),


  // -------------------------------------------------------------------------
  // Methods
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
