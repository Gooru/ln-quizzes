import Ember from 'ember';
import TaxonomyTagData from 'quizzes/models/taxonomy/taxonomy-tag-data';
import ModalMixin from 'quizzes/mixins/modal';
import TaxonomyTag from 'quizzes/models/taxonomy/taxonomy-tag';

export default Ember.Controller.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies

  queryParams: ['term', 'taxonomies'],

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Services
  /**
   * @property {Ember.Service} Service to do the search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service("taxonomy"),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    setSubject: function(subject){
      const controller = this;
      controller.get('taxonomyService').getCourses(subject).then(function(){
        controller.openTaxonomyModal(subject);
      });
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string} term filter
   */
  term: null,

  /**
   * @property {string} collection type filter
   */
  collectionType: null,

  /**
   * Configured standards
   * @property {Standard[]}
   */
  standards: null,

  /**
   * These are the collection search results
   * @property {CollectionResult[]}
   */
  collectionResults: null,

  /**
   * Type of collection filter selected
   *  @property {string} selectedFilterType
   *
   */
  selectedFilterType: 'collection',

  /**
   * @property {TaxonomyTagData[]}
   */
  selectedStandards: Ember.A([]),

  /**
   * @property {string} taxonomies query param
   */
  taxonomies: Ember.A([]),

  /**
   * @property {selectedTags[]} selected tags
   */
  selectedTags: Ember.A([]),


  // -------------------------------------------------------------------------
  // Methods
  openTaxonomyModal: function(subject){
    var controller = this;
    var standards = controller.get("selectedTags").map(function(selectedTag) {
      return selectedTag.get('data');
    });
    var subjectStandards = TaxonomyTagData.filterBySubject(subject, standards);
    var notInSubjectStandards = TaxonomyTagData.filterByNotInSubject(subject, standards);
    var model = {
      selected: subjectStandards,
      subject: subject,
      fromSearch: true,
      callback: {
        success: function(selectedTags) {
          var dataTags = selectedTags.map(function(taxonomyTag) {
            return taxonomyTag.get('data');
          });
          const standards = Ember.A(dataTags);
          standards.pushObjects(notInSubjectStandards.toArray());

          var taxonomies = Ember.A([]);
          var selectTaxonomyTags = Ember.A([]);

          standards.forEach(function(taxonomyTagData) {
            taxonomies.push(taxonomyTagData.get("id"));
            selectTaxonomyTags.push(controller.createTaxonomyTag(taxonomyTagData));
          });

          controller.set('taxonomies', taxonomies);
          controller.set('selectedTags', selectTaxonomyTags);
         }
      }
    };

    this.actions.showModal.call(this, 'taxonomy.modals.gru-standard-picker', model, null, 'gru-standard-picker');
  },

  createTaxonomyTag: function(dataTag) {
    return TaxonomyTag.create({
      isActive: true,
      isReadonly: true,
      isRemovable: true,
      data: dataTag
    });
  }

});
