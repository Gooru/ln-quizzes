import Ember from 'ember';
import {K12_CATEGORY} from 'gooru-web/config/config';
import PublicRouteMixin from "gooru-web/mixins/public-route-mixin";
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';

/**
 * @typedef {object} SearchCollectionsController
 */
export default Ember.Route.extend(PublicRouteMixin, {

  queryParams: {
    term: {
      /**
       Only 'term' query param should refresh the entire model, since the event is handled by
       the application route. Other query params are handled by the collection controller

       @see routes/application.js#searchTerm
       */
      refreshModel: true
    },
    taxonomies: {
      refreshModel: true
    }
  },

  /**
   * @requires service:api-sdk/search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  /**
   * @requires service:api-sdk/taxonomy
   */
  taxonomySdkService: Ember.inject.service('api-sdk/taxonomy'),


  model: function(params) {
    const taxonomyIds = params.taxonomies;
    const subjects = this.get('taxonomyService').getSubjects(K12_CATEGORY.value);
    var taxonomyCodes = [];

    if (taxonomyIds.length > 0) {
      taxonomyCodes = this.get('taxonomySdkService').fetchCodesByIds(taxonomyIds);
    }

    return Ember.RSVP.hash({
      subjects: subjects,
      taxonomyCodes: taxonomyCodes
    });
  },
  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    const route = this;
    controller.set('subjects', model.subjects);
    var selectedTags = controller.get('selectedTags');
    if (!selectedTags.length) {
      selectedTags = model.taxonomyCodes.map(function(taxonomyCode) {
        const framework = route.extractFramework(model.subjects, taxonomyCode.id);
        return controller.createTaxonomyTag(TaxonomyTagData.create({
          id: taxonomyCode.id,
          code: taxonomyCode.code,
          frameworkCode: framework ? framework.get('frameworkId') : '',
          parentTitle: framework ? framework.get('subjectTitle') : '',
          title: taxonomyCode.title
        }));
      });
      controller.set("selectedTags", selectedTags);
    }
  },

  // -------------------------------------------------------------------------
  // Actions - only transition actions should be placed at the route
  actions: {
    /**
     * Action triggered to open the content player
     * @param {string} collection collection identifier
     */
    onOpenContentPlayer: function(collection) {
      if (collection.get("isExternalAssessment")){
        window.open(collection.get("url")); //TODO url?
      }
      else {
        this.transitionTo('player', collection.get("id"), { queryParams: { type: collection.get("collectionType") } });
      }
    }
  },

  extractFramework: function(subjects, codeId) {
    const frameworkId = codeId.split('-')[0];
    var framework = undefined;
    subjects.forEach(function(subject) {
      if (!framework) {
        const frameworks = subject.get('frameworks');
        if (frameworks.length) {
          framework = frameworks.findBy('id', frameworkId);
        }
      }
    });
    return framework ? framework : null;
  }

});
