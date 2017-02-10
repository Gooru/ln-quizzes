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
          title: component.get('collection.title'),
          assignees: []
        }));
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
