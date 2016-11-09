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

  classNames: ['gru-assign-students'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /***
     * Select all students
     */
    selectAll:function(){
      const content = this ;
      this.set('areAllSelected',!this.get('areAllSelected'));
      this.get('students').map(function(student){
        if(content.get('areAllSelected')){
          student.set('isAssigned',true);
        }else{
          student.set('isAssigned',false);
        }
      });
    },
    /***
     * Search student
     */
    selectStudent: function (student) {
      student.set('isAssigned',!student.get('isAssigned'));
    },
    /***
     * Cancel assign student
     */
    cancel:function(){
      this.sendAction('onCloseModal');
    }
  },

  // -------------------------------------------------------------------------
  // Events

  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
    const component = this;
    $('.live-search-list a').each(function(){
      $(this).attr('data-search-term', $(this).text().toLowerCase());
    });
    $('.search-box').on('keyup', function(){
      component.searchStudent();
    });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Assessment
   */
  assessment:Ember.Object.create({
    title:'Water Cycle'
  }),

  areAllSelected:false,

  /**
   * Student List
   */
  students:null,
  /**
   * Total student selected
   */
  totalSelected:Ember.computed('students.@each.isAssigned',function(){
    return this.get('students').filterBy('isAssigned',true).length;
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Filter student list by name
   */
  searchStudent:function(){
    var searchTerm = $('.gru-assign-students .search-box').val().toLowerCase();

    $('.live-search-list a').each(function(){
      if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
});
