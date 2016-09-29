import Ember from 'ember';
import ContentEditMixin from 'quizzes/mixins/content/edit';
import { RESOURCE_COMPONENT_MAP, RESOURCE_TYPES,CONTENT_TYPES, K12_CATEGORY } from "quizzes/config/config";
import TaxonomyTag from 'quizzes/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes/models/taxonomy/taxonomy-tag-data';
import ModalMixin from 'quizzes/mixins/modal';

export default Ember.Component.extend(ContentEditMixin, ModalMixin,{
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:api-sdk/resource
   */
  resourceService: Ember.inject.service("api-sdk/resource"),

  /**
   * @requires service:api-sdk/profile
   */
  profileService: Ember.inject.service("api-sdk/profile"),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),


  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'resources', 'gru-resource-edit'],

  tagName: 'article',

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Edit Content
     */
    editContent: function () {
      var resourceForEditing = this.get('resource').copy();
      this.set('tempResource', resourceForEditing);
      this.set('isEditing', true);
    },

    /**
     * Select resource type
     */
    selectType:function(type){
      this.set('tempResource.format', type);
    },

    /**
     * Save updated content
     */
    updateContent: function() {
      this.saveContent();
    },

    /**
     * Save settings profile visibility option
     */
    publishToProfile: function() {
      var resourceForEditing = this.get('resource').copy();
      this.set('tempResource', resourceForEditing);
      this.saveContent();
    },
    /**
     * Delete resource
     */
    deleteResource: function () {
      const myId = this.get("session.userId");
      var model = {
        content: this.get('resource'),
        deleteMethod: function () {
          return this.get('resourceService').deleteResource(this.get('resource.id'));
        }.bind(this),
        type: CONTENT_TYPES.RESOURCE,
        redirect: {
          route: 'profile.content.courses',
          params: {
            id: myId
          }
        }
      };

      this.actions.showModal.call(this,
        'content.modals.gru-delete-resource',
        model, null, null, null, false);
    },

    addToCollection: function() {
      const component = this;
      if (component.get('session.isAnonymous')) {
        component.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        component.get('profileService').readCollections(component.get('session.userId')).then(
          function(collections) {
            component.send('showModal', 'content.modals.gru-add-to-collection', {
              content: component.get('resource'),
              collections
            }, null, "add-to");
        });
      }
    },

    selectSubject: function(subject){
      this.set("selectedSubject", subject);
    },

    /**
     * Remove tag data from the taxonomy list in tempUnit
     */
    removeTag: function (taxonomyTag) {
      var tagData = taxonomyTag.get('data');
      this.get('tempResource.standards').removeObject(tagData);
    },

    openTaxonomyModal: function(){
      this.openTaxonomyModal();
    },

    setPublisher: function(checked) {
      var tempResource = this.get('tempResource');
      if(checked){
        tempResource.set('publisher', this.get("session.userData.username"));
        tempResource.set('amIThePublisher', true);
      } else {
        tempResource.set('publisher', '');
        tempResource.set('amIThePublisher', false);
      }
    },
    linkSwitch:function(){
      var tempResource = this.get('tempResource');
      tempResource.set('displayGuide', this.get('tempResource.displayGuide'));
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Resource model as instantiated by the route. This is the model used when not editing
   * or after any resource changes have been saved.
   * @property {Resource}
   */
  resource: null,

  /**
   * Copy of the resource model used for editing.
   * @property {Resource}
   */
  tempResource: null,

  /**
   * List of resource types
   * @property {Array}
   */
  resourceTypes: RESOURCE_TYPES,

  /**
   * Determines the name of the component that renders the resource
   * @property {String}
   */
  resourceComponent: Ember.computed('resource.resourceType', function() {
    return RESOURCE_COMPONENT_MAP[this.get('resource.resourceType')];
  }),

  /**
   *
   * @property {TaxonomyRoot}
   */
  selectedSubject: null,

  /**
   * @property {string}
   */
  k12Category: K12_CATEGORY.value,

  /**
   * @property {boolean}
   */
  standardDisabled: Ember.computed.not("selectedSubject"),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('resource.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("resource.standards"), false);
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  editableTags: Ember.computed('tempResource.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("tempResource.standards"), false, true);
  }),

  /**
   * Toggle Options
   * @property {Ember.Array}
   */
  switchOptions: Ember.A([Ember.Object.create({
    'label': "On",
    'value': true
  }),Ember.Object.create({
    'label': "Off",
    'value': false
  })]),
  /**
   * Indicates if the current resource type is resource
   * @property {boolean}
   */
  isNotIframeUrl: Ember.computed("resource", function(){
    const resource = this.get("resource");
    return (resource && resource.displayGuide);
  }),

  // ----------------------------
  // Methods
  openTaxonomyModal: function(){
    var component = this;
    var standards = component.get('tempResource.standards') || [];
    var subject = component.get('selectedSubject');
    var subjectStandards = TaxonomyTagData.filterBySubject(subject, standards);
    var notInSubjectStandards = TaxonomyTagData.filterByNotInSubject(subject, standards);
    var model = {
      selected: subjectStandards,
      shortcuts: null,  // TODO: TBD
      subject: subject,
      callback: {
        success: function(selectedTags) {
          var dataTags = selectedTags.map(function(taxonomyTag) {
            return taxonomyTag.get('data');
          });
          const standards = Ember.A(dataTags);
          standards.pushObjects(notInSubjectStandards.toArray());
          component.set('tempResource.standards', standards);
        }
      }
    };

    this.actions.showModal.call(this, 'taxonomy.modals.gru-standard-picker', model, null, 'gru-standard-picker');
  },

  /**
   * Save Content
   */
  saveContent: function () {
    const component = this;
    var editedResource = component.get('tempResource');
    editedResource.validate().then(function({ validations }) {
      if (validations.get('isValid')) {
        component.get('resourceService').updateResource(component.get('resource.id'), editedResource)
          .then(function () {
            component.set('resource', editedResource);
            component.set('isEditing', false);
          })
          .catch(function () {
            var message = component.get('i18n').t('common.errors.resource-not-updated').string;
            component.get('notifications').error(message);
          });
      }
      component.set('didValidate', true);
    });
  }
});
