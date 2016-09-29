import Ember from 'ember';
import BaseController from 'quizzes/controllers/search/base-controller';

/**
 * Collection search controller
 *
 */
export default BaseController.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  collectionResults: Ember.computed.alias('searchResults'),

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
    this.get('searchService').searchCollections(term, params).then(callback);
  }

});
