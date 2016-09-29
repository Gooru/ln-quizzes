import Ember from 'ember';
import {DEFAULT_PAGE_SIZE} from 'quizzes/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  contentController: Ember.inject.controller('profile.content'),


  profileController: Ember.inject.controller('profile'),

  /**
   * @type {ProfileService} Service to retrieve profile information
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    openContentPlayer: function(collection) {
      this.transitionToRoute('player', collection.id, { queryParams: { type: collection.get("collectionType")}});
    },

    showMoreResults: function(){
      this.showMoreResults();
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {string} term filter
   */
  term: Ember.computed.alias("contentController.term"),

  /**
   * @property {string} sortOn filter
   */
  sortOn: Ember.computed.alias("contentController.sortOn"),

  /**
   * @property {string} order filter
   */
  order: Ember.computed.alias("contentController.order"),

  /**
   * @property {Collection[]} collections
   */
  collections: null,

  /**
   * @property {boolean} isMyProfile
   */
  isMyProfile: Ember.computed.alias("profileController.isMyProfile"),

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias("profileController.profile"),

  /**
   * @property {*}
   */
  pagination: {
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE
  },

  /**
   * @property {boolean}
   */
  showMoreResultsButton: Ember.computed("collections.[]", function(){
    return this.get("collections.length") &&
      (this.get("collections.length") % this.get("pagination.pageSize") === 0);
  }),

  // Methods
  showMoreResults: function(){
    const controller = this;
    const profile = this.get('profile');
    const pagination = this.get('pagination');
    pagination.page = pagination.page + 1;
    pagination.searchText = this.get('term');
    pagination.sortOn = this.get('sortOn');
    pagination.order = this.get('order');

    controller.get('profileService')
      .readCollections(profile.get("id"), pagination)
      .then(function(collections){
        controller.get("collections").pushObjects(collections.toArray());
      });
  },

  resetValues: function(){
    this.set("pagination", {
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
  }


});
