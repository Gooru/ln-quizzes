import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {CollectionService} collectionService
   * @property {Ember.Service} Service to retrieve a collection
   */
  collectionService: Ember.inject.service('api-sdk/collection'),

  /**
   * @type {ContextService} contextService
   * @property {Ember.Service} Service to send context related events
   */
  contextService: Ember.inject.service('api-sdk/context'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['qz-player'],

  classNameBindings:['showConfirmation:confirmation'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Triggered when an resource emotion is selected
     * @param {string} emotionScore
     */
    changeEmotion: function(emotionScore) {
      let resourceResult = this.get('resourceResult');
      resourceResult.set('reaction', emotionScore);
    },

    /**
     * Action triggered when the user close de navigator panel
     */
    closeNavigator:function(){
      const $appContainer = Ember.$( '.app-container' );
      if ($appContainer.hasClass( 'navigator-on' )){
        $appContainer.removeClass( 'navigator-on' );
      }
    },

    /**
     * When clicking at submit all or end
     */
    finishCollection: function() {
      const component = this;
      const collection = component.get('collection');
      let contextResult = component.get('contextResult');
      let resourceResult = component.get('resourceResult');
      component.saveResourceResult(null, contextResult, resourceResult).then(() => {
        if (collection.get('isAssessment')) {
          //open confirmation modal
          component.finishConfirm();
        } else {
          //finishes the last resource
          component.finishCollection();
        }
      });
    },

    /**
     * Action triggered when the user open the navigator panel
     */
    openNavigator: function(){
      Ember.$( '.app-container' ).addClass( 'navigator-on' );
    },

    /**
     * Action triggered when the user open the player
     */
    openPlayer:function(){
      const component = this;
      let startContext = component.get('startContextFunction');
      startContext().then(function(contextResult){
        contextResult.merge(component.get('collection'));
        component.set('contextResult',contextResult);
        component.set('showConfirmation',false);
        component.startAssessment();
      });
    },

    /**
     * Triggered when a navigator resource is selected
     * @param {Resource} resource
     */
    selectNavigatorItem: function(resource){
      const component = this;
      component.moveToResource(resource);
    },

    /**
     * Handle onSubmitQuestion event from qz-question-viewer
     * @see components/player/qz-question-viewer.js
     * @param {Resource} question
     * @param {QuestionResult} questionResult
     */
    submitQuestion: function(question){
      const component = this;
      component.moveOrFinish(question);
    }
  },
  // -------------------------------------------------------------------------
  // Events

  init: function() {
    this._super(...arguments);
    if(this.get('collection.isCollection')){
      this.set('showConfirmation',false);
      this.startAssessment();
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {ContextResult} contextResult
   */
  contextResult: null,

  /**
   * The collection presented in this player
   * @property {Collection} collection
   */
  collection: null,

  /**
   * Is Assessment
   * @property {boolean}
   */
  isAssessment: Ember.computed.alias('collection.isAssessment'),

  /**
   * Should resource navigation in the player be disabled?
   * @property {Lesson}
   */
  isNavigationDisabled: false,

  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isResource: Ember.computed('resource', function(){
    const resource = this.get('resource');
    return (resource && !resource.get('isQuestion'));
  }),

  /**
   * Indicates if the student is playing the collection
   * @property {boolean}
   */
  isStudent: Ember.computed.equal('role', 'student'),

  /**
   * Indicates if the teacher is playing this collection
   * @property {boolean}
   */
  isTeacher: Ember.computed.not('isStudent'),

  /**
   * URL to redirect to student report
   * @property {String} reportURL
   */
  reportURL: null,

  /**
   * The resource playing
   * @property {Resource} resource
   */
  resource: null,

  /**
   * Query param
   * @property {string} resourceId
   */
  resourceId: null,

  /**
   * Return the list of resources available to show on the player
   * @property {ResourceResult[]}
   */
  resourcesPlayer: Ember.computed('collection.resources','contextResult.sortedResourceResults', function(){
    let availableResources = this.get('collection.resources').mapBy('id');
    return this.get('contextResult.sortedResourceResults').filter(function(item){
       return item.resourceId && availableResources.includes(item.resourceId);
    });
  }),

  /**
   * The resource result playing
   * @property {ResourceResult}
   */
  resourceResult: null,

  /**
   * Indicates the user's role, could be 'student', 'teacher' or null
   * This property is not used for the context-player
   * @property {string}
   */
  role: null,

  /**
   * @property {boolean} indicates if the answer should be saved
   */
  saveEnabled: true, // save only when logged in

  /**
   * Indicates if content should be displayed
   * @property {boolean} showContent
   */
  showContent: false,

  /**
   * Indicates if show the assessment confirmation
   * @property {boolean} showConfirmation
   */
  showConfirmation: true,

  /**
   * Indicates if the report should be displayed
   * @property {boolean} showReport
   */
  showReport: false,

  /**
   * Query param indicating if it is a collection or assessment
   * @property {string}
   */
  type: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Saves an assessment result
   */
  finishCollection: function() {
    const component = this;
    let contextResult = component.get('contextResult');
    let promise = !component.get('saveEnabled') ? Ember.RSVP.resolve() :
        component.get('contextService').finishContext(contextResult.get('contextId'));
    return promise.then(() => this.redirectToReport());
  },

  /**
   * Opens the confirmation dialog to finish the assessment
   */
  finishConfirm: function() {
    const component = this;
    component.actions.showModal.call(this,
      'modals.gru-submit-confirmation', {
        onConfirm: component.finishCollection.bind(component)
      });
  },

  /**
   * Moves to the next resource or finishes the collection
   * @param {Resource} resource
   */
  moveOrFinish: function(resource) {
    const component = this;
    const next = component.get('collection').nextResource(resource);
    if (next) {
      Ember.$(window).scrollTop(0);
      component.moveToResource(next);
    } else {
      let contextResult = component.get('contextResult');
      let resourceResult = component.get('resourceResult');
      return component.saveResourceResult(null, contextResult, resourceResult)
        .then(() => component.finishConfirm());
    }
  },

  /**
   * Moves to resource
   * @param {Resource} resource
   */
  moveToResource: function(resource, firstTime) {
    const component = this;
    let contextResult = component.get('contextResult');
    let resourceResult = component.get('resourceResult');
    let resourceId = resource.get('id');
    return component.saveResourceResult(resourceId, contextResult, resourceResult, firstTime)
      .then(function() {
        Ember.run(() => component.set('resource', null));
        resourceResult = contextResult.getResultByResourceId(resourceId);
        resourceResult.set('startTime', new Date().getTime());
        component.setProperties({
          showReport: false,
          resourceId,
          resource,
          resourceResult
        }); //saves the resource status
      });
  },

  /**
   * Redirect to the student report
   */
  redirectToReport: function() {
    const reportURL = this.get('reportURL');
    if(reportURL){
      let url = reportURL.replace('{context-id}', this.get('contextResult.contextId'));
      window.location.href = url;
    } else {
      this.get('router').transitionTo(
        'reports.student-context',
        this.get('contextResult.contextId')
      );
    }
  },

  /**
   * Saves the resource result and moves to the next
   * @param resourceId
   * @param contextResult
   * @param resourceResult
   * @returns {Promise.<boolean>}
   */
  saveResourceResult: function(resourceId, contextResult, resourceResult, firstTime) {
    let component = this;
    let promise = Ember.RSVP.resolve();
    let save = component.get('saveEnabled');
    if (save) {
      let contextId = contextResult.get('contextId');
      if(resourceResult) {
        resourceResult.set('stopTime', new Date().getTime());
      }
      promise = firstTime ? Ember.RSVP.resolve() :
        component.get('contextService')
          .moveToResource(resourceId, contextId, resourceResult);
    }
    return promise;
  },

  /**
   * Starts the assessment or collection
   */
  startAssessment: function() {
    const component = this;
    const collection = component.get('collection');
    const contextResult = component.get('contextResult');
    const hasResources = collection.get('hasResources');
    let resource = null;

    component.set('showContent', true);
    if(hasResources) {
      resource = contextResult.get('currentResource');
      if(component.get('resourceId')) { //if has a resource id as query param
        resource = collection.getResourceById(component.get('resourceId'));
      }
    }
    if(resource) {
      component.moveToResource(resource, true);
    }
  }
});
