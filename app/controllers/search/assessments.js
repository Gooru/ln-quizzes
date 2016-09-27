import Ember from 'ember';
import BaseController from 'gooru-web/controllers/search/base-controller';

/**
 * Assessments Controller
 *
 */
export default BaseController.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  assessmentResults: Ember.computed.alias('searchResults'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Services

  // -------------------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------------
  // Methods

  doSearch: function(term, params, callback) {
    this.get('searchService').searchAssessments(term, params).then(callback);
  }

});
