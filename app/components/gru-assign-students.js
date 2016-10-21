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
          student.set('isSelected',true);
        }else{
          student.set('isSelected',false);
        }
      });
    },
    /***
     * Search student
     */
    selectStudent: function (student) {
      student.set('isSelected',!student.get('isSelected'));
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
  students:Ember.A([
    Ember.Object.create({
      firstName:'firstname-1',
      lastName:'lastname-1',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-2',
      lastName:'lastname-2',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-3',
      lastName:'lastname-3',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-4',
      lastName:'lastname-4',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-5',
      lastName:'lastname-5',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-6',
      lastName:'lastname-6',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-7',
      lastName:'lastname-7',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-8',
      lastName:'lastname-8',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-9',
      lastName:'lastname-9',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-10',
      lastName:'lastname-10',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-11',
      lastName:'lastname-11',
      isSelected:false
    })
    ]),
  /**
   * Total student selected
   */
  totalSelected:Ember.computed('students.@each.isSelected',function(){
    return this.get('students').filterBy('isSelected',true).length;
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Filter stundent list by student name
   */
  searchStudent:function(){
    var searchTerm = $('.search-box').val().toLowerCase();

    $('.live-search-list a').each(function(){
      if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
});
