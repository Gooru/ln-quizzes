import Ember from 'ember';
import Context from 'quizzes/models/context/context';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),
  /**
   * @property {Service} context service
   */

  contextService: Ember.inject.service("api-sdk/context"),

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
      this.get('students').forEach(student => student.set('isAssigned', content.get('areAllSelected')));
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
    },
    /***
     * Assign students
     */
    assignStudents:function(){
      let component = this;
      let assignedStudents = component.get('students').filterBy('isAssigned',true);

      component.get('assignment').setProperties({
        title:component.get('collection.title'),
        collectionId:component.get('collection.id'),
        owner:component.get('owner'),
        assignees:assignedStudents
      });

      if(component.get('assignment.id')){
        component.get('contextService').updateContext(component.get('assignment')).then(function(){
          component.sendAction('onCloseModal');
        });
      }else{
        component.get('contextService').createContext(component.get('assignment')).then(function(){
          Ember.Logger.log('Context has been created');
        });
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
   * Assignment
   */
  assignment: Context.create({
  }),
  /**
   * Indicate if all students are selected
   */
  areAllSelected:false,
  /**
   * Collection
   */
  collection:null,
  /**
   * Student List
   */
  students:[],
  /**
   * The owner of the context
   */
  teacher:null,
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
