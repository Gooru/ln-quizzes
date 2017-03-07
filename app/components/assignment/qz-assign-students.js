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
  contextService: Ember.inject.service('api-sdk/context'),

  /**
   * @type {ConfigurationService} Service to retrieve configuration information
   */
  configurationService: Ember.inject.service('configuration'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-assign-students'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /***
     * Assign students
     */
    createContext:function(){
      let component = this;
      component.get('contextService').createContext(component.get('assignment')).then(function () {
        component.set('assignment', Context.create(Ember.getOwner(component).ownerInjection(), {
          title: component.get('collection.title')
        }));
      });
    },
    /***
     * Create context as anonymous
     */
    createContextAnonymous:function(){
      let component = this;
      let assignment = component.get('assignment');
      assignment.set('classId', null);
      const collectionType = assignment.get('isCollection') ? 'collection' : 'assessment';
      component.get('contextService').createContext(assignment).then(({ id }) => {
        const configurationService = component.get('configurationService');
        configurationService.addProperties({
            type:collectionType,
            profileId: localStorage.getItem('profileId'),
            token: localStorage.getItem('token'),
            reportURL:'student-report-embedded.html?context-id={context-id}&type=' + collectionType
          }
        );
        component.get('router').transitionTo('player', id);
      });
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    let context = Context.create({});
    this.set('assignment', context);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Assignment
   */
  assignment:null

});
