import Ember from 'ember';
import ContentEditMixin from 'quizzes/mixins/content/edit';
import ModalMixin from 'quizzes/mixins/modal';
import {CONTENT_TYPES, K12_CATEGORY} from 'quizzes/config/config';
import TaxonomyTag from 'quizzes/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'quizzes/models/taxonomy/taxonomy-tag-data';

export default Ember.Component.extend(ContentEditMixin, ModalMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:notifications
   */
  notifications: Ember.inject.service(),

  /**
   * @requires service:api-sdk/course
   */
  collectionService: Ember.inject.service("api-sdk/collection"),

  /**
   * @property {MediaService} Media service API SDK
   */
  mediaService: Ember.inject.service("api-sdk/media"),

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service("session"),
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'collections', 'gru-collection-edit'],

  tagName: 'article',

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Edit Content
     */
    editContent: function () {
      var collectionForEditing = this.get('collection').copy();
      this.set('tempCollection', collectionForEditing);
      this.set('isEditing', true);
    },

    /**
     * Save Content
     */
    updateContent: function () {
      let component = this;
      let editedCollection = component.get('tempCollection');
      let collection = component.get('collection');
      editedCollection.validate().then(function ({validations }) {
        if (validations.get('isValid')) {
          let imageIdPromise = new Ember.RSVP.resolve(editedCollection.get('thumbnailUrl'));
          if(editedCollection.get('thumbnailUrl') && editedCollection.get('thumbnailUrl') !== collection.get('thumbnailUrl')) {
            imageIdPromise = component.get('mediaService').uploadContentFile(editedCollection.get('thumbnailUrl'));
          }
          imageIdPromise.then(function(imageId) {
            editedCollection.set('thumbnailUrl', imageId);
            component.get('collectionService').updateCollection(editedCollection.get('id'), editedCollection)
              .then(function () {
                collection.merge(editedCollection,
                  ['title', 'learningObjectives', 'isVisibleOnProfile', 'thumbnailUrl', 'standards']);
                component.set('isEditing', false);
              })
              .catch(function (error) {
                var message = component.get('i18n').t('common.errors.collection-not-updated').string;
                component.get('notifications').error(message);
                Ember.Logger.error(error);
              });
          });
        }
        this.set('didValidate', true);
      }.bind(this));
    },

    /**
     * Save setting for visibility of collection in profile
     */
    publishToProfile: function() {
      var collectionForEditing = this.get('collection').copy();
      this.set('tempCollection', collectionForEditing);
      this.actions.updateContent.call(this);
    },
    /**
     * Delete collection
     */
    deleteItem: function () {
      const myId = this.get("session.userId");
      var model = {
        content: this.get('collection'),
        isHeaderDelete:true,
        parentName:this.get('course.title'),
        deleteMethod: function () {
          return this.get('collectionService').deleteCollection(this.get('collection.id'));
        }.bind(this),
        type: CONTENT_TYPES.COLLECTION,
        redirect: {
          route: 'profile.content.courses',
          params: {
            id: myId
          }
        }
      };

      this.actions.showModal.call(this,
        'content.modals.gru-delete-content',
        model, null, null, null, false);
    },

    selectSubject: function(subject){
      this.set("selectedSubject", subject);
    },

    /**
     * Remove tag data from the taxonomy list in tempUnit
     */
    removeTag: function (taxonomyTag) {
      var tagData = taxonomyTag.get('data');
      this.get('tempCollection.standards').removeObject(tagData);
    },

    openTaxonomyModal: function(){
      this.openTaxonomyModal();
    }
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * Collection model as instantiated by the route. This is the model used when not editing
   * or after any collection changes have been saved.
   * @property {Collection}
   */
  collection: null,

  /**
   * Course model as instantiated by the route. This is the course that have the assigned collection
   * @property {Course}
   */
  course: null,

  /**
   * Copy of the collection model used for editing.
   * @property {Collection}
   */
  tempCollection: null,

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
   * Indicate if the button "Back to course" is available.
   */
  allowBack: Ember.computed('collection', function() {
    return this.get('collection.courseId');
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('collection.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("collection.standards"), false);
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  editableTags: Ember.computed('tempCollection.standards.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("tempCollection.standards"), false, true);
  }),

  // ----------------------------
  // Methods
  openTaxonomyModal: function(){
    var component = this;
    var standards = component.get('tempCollection.standards') || [];
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
          component.set('tempCollection.standards', standards);
        }
      }
    };

    this.actions.showModal.call(this, 'taxonomy.modals.gru-standard-picker', model, null, 'gru-standard-picker');
  }
});
