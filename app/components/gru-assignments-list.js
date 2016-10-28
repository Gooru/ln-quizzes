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
  // Methods
  /**
   * Filter assigment by title
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
