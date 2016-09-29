import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';
import TaxonomyTag from 'quizzes/models/taxonomy/taxonomy-tag';

/**
 * Course card
 *
 * Component responsible of showing the course information in cards, so that most useful information is summarized there.
 * @module
 * @see controllers/profile/about.js
 */
export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['cards','gru-course-card'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     *Action triggered when select edit the course
     */
    editCourse:function(){
      this.sendAction("onEditCourse", this.get("course"));
    },

    /**
     *Action triggered when select play the course
     */
    playCourse:function(){
      this.sendAction("onPlayCourse", this.get("course"));
    },

    /**
     *Action triggered when select remix the course
     */
    remixCourse:function(){
      if (this.get('session.isAnonymous')) {
        this.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        this.sendAction("onRemixCourse", this.get("course"));
      }
    }
  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Course} course
   */
  course: null,

  /**
   * Edit course action
   * @property {string}
   */
  onEditCourse: null,

  /**
   * Remix course action
   * @property {string}
   */
  onRemixCourse: null,

  /**
   * flag that tells if you are owner of card or not.
   * @property {Boolean}
   */
  isOwner : false,
  /**
   * Edit enabled is a flag for whether the edit button is enabled or not.
   * @property {Boolean}
   */
  isEditEnabled: false,
  /**
   * Edit enabled is a flag for whether the remix button is enabled or not.
   * @property {Boolean} course
   */
  isRemixEnabled:true,
  /**
   * Edit enabled is a flag for whether the preview button is enabled or not.
   * @property {Boolean} course
   */
  isPreviewEnabled:false,

  /**
   * Show if the visibility icon is visible or not.
   * @property {Boolean}
   */
  isEyeVisible: true,

  /**
   * @property {Array} users
   */
  users:Ember.computed('course', function() {
    return this.get("course.remixedBy");
  }),
  /**
   * @property {String} subjects
   */
  subjects:Ember.computed('course', function() {
    // TODO Verify if this method is required
    /*
    var subjectsList = this.get("course.subjects");
    var subjects = "";
    subjectsList.forEach(function(object){
      subjects+=" "+object+" |";
    });
    return subjects.substr(0, subjects.length-1);
    */
    return "";
  }),

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('course.taxonomy.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get('course.taxonomy'));
  }),

  /*
  * Events
  */
  didRender(){
    $('[data-toggle="tooltip"]').tooltip();
  }

});
