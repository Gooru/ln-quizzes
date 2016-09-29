import Ember from 'ember';
import {DEFAULT_PAGE_SIZE} from 'quizzes/config/config';
export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  profileController: Ember.inject.controller('profile'),

  /**
   * @type {ProfileService} Profile service object
   */
  profileService: Ember.inject.service('api-sdk/profile'),


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Content/Course[]} courses
   */
  courses: null,

  /**
   * @property {Profile}
   */
  profile: Ember.computed.alias("profileController.profile"),

  /**
   * @property {boolean} isMyProfile
   */
  isMyProfile: Ember.computed.alias("profileController.isMyProfile"),

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
  showMoreResultsButton: Ember.computed("courses.[]", function(){
    return this.get("courses.length") &&
      (this.get("courses.length") % this.get("pagination.pageSize") === 0);
  }),

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    showMoreResults: function(){
      this.showMoreResults();
    }
  },

  // -------------------------------------------------------------------------
  // Methods
  showMoreResults: function(){
    const controller = this;
    const profile = this.get("profile");
    const pagination = this.get("pagination");
    pagination.page = pagination.page + 1;

    controller.get('profileService')
      .getCourses(profile, null, pagination)
      .then(function(courses){
        controller.get("courses").pushObjects(courses.toArray());
    });
  },

  resetValues: function(){
    this.set("pagination", {
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
    this.set('disableSearch',false);
  }
});
