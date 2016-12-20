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

    selectOption: function (type) {
      this.set('showAssessmentSetting', type === 'assessmentSettings');
      this.set('showStudentRoster', type === 'studentRoster');
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
      let assigment = component.get('assignment');
      if(!this.get('didValidate')) {
        Ember.$('#date-availableDate').blur();
        Ember.$('#time-availableDate').blur();
        Ember.$('#date-dueDate').blur();
        Ember.$('#time-dueDate ').blur();
      }

      assigment.validate().then(function ({ validations }) {
        let assignedStudents = component.get('students').filterBy('isAssigned',true);
        assigment.set('assignees',assignedStudents);

        if (validations.get('isValid')) {
          if(component.get('assignment.id')){
            component.get('contextService').updateContext(component.get('assignment')).then(function(){
              component.set('didValidate', true);
              component.sendAction('onUpdateAssignment', component.get('assignment'));
            });
          }else{
            component.get('contextService').createContext(component.get('assignment')).then(function(){
              component.set('assignment', Context.create(Ember.getOwner(component).ownerInjection(),{
                title:component.get('collection.title')
              }));
            });
          }
        }else if(validations.get('error.attribute') === 'assignees'){
          component.set('assigneesError',validations.get('error.message'));
        }
      });
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    let context = Context.create(Ember.getOwner(this).ownerInjection(),{});
    let assignedStudents = this.get('students').filterBy('isAssigned',true);
    if(!this.get('assignment.id')){
       context.setProperties({
        title:this.get('collection.title'),
        externalCollectionId:this.get('collection.id'),
        owner:this.get('owner'),
        assignees:assignedStudents
      });
    }else{
      context = Context.create(Ember.getOwner(this).ownerInjection(),this.get('assignment'));
    }
    this.set('assignment', context);
  },
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
  assignment:null,
  /**
   * Assignees error
   */
  assigneesError:null,
  /**
   * Indicate if all students are selected
   */
  areAllSelected:false,
  /**
   * Collection
   */
  collection:null,
  /**
   * * @param {Boolean } didValidate - value used to check if input has been validated or not
 */
  didValidate: false,
  /**
   * Student List
   */
  students:[],
  /**
   * Indicates when then assessments settings are visible
   * @property {boolean}
   */
  showAssessmentSetting: true,

  /**
   * Indicates when then student roster are visible
   * @property {boolean}
   */
  showStudentRoster: false,
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
  },
  // -------------------------------------------------------------------------
  // Observers
  /**
   * Clean the assignment properties
   */
  cleanAssignment: Ember.observer('assignment', function() {
    this.get('students').forEach(student => student.set('isAssigned', false));

  })
});
