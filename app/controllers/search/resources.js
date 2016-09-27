import Ember from 'ember';
import BaseController from 'gooru-web/controllers/search/base-controller';

/**
 * Resources search controller
 *
 */
export default BaseController.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  resourceResults: Ember.computed.alias('searchResults'),

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  // -------------------------------------------------------------------------
  // Methods

  doSearch: function(term, params, callback) {
    this.get('searchService').searchResources(term, params).then(callback);
  }

});
