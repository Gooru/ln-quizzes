import Ember from 'ember';
import ModalMixin from 'quizzes/mixins/modal';
import TaxonomyTag from 'quizzes/models/taxonomy/taxonomy-tag';

export default Ember.Component.extend(ModalMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'courses', 'gru-course-play'],

  classNameBindings: ['view', 'fixed-header'],

  tagName: 'article',


  // -------------------------------------------------------------------------
  // Actions

  actions:  {
    view: function(viewName) {
      this.set('view', viewName);
    },

    remix: function() {
      if (this.get('session.isAnonymous')) {
        this.send('showModal', 'content.modals.gru-login-prompt');
      } else {
        var model = {
          content: this.get('course')
        };
        this.send('showModal', 'content.modals.gru-course-remix', model);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events
  didInsertElement: function () {
    this._super(...arguments);

    const $header = this.$().find('> header');

    if ($header.find('nav').css('display') !== 'none') {
      // If there's a nav in the header then the resolution must be xs or sm
      // Set the default view
      this.set('view', 'content-view');
    }

    // Add fix header behaviour
    var headerWidth = $header.css('width');
    headerWidth = headerWidth && headerWidth.split('px')[0] || '100%';

    // Add inline styles to preserve the same look
    $header.css({
      width: headerWidth
    });

    this.set('fixed-header', true);
  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * Course model as instantiated by the route.
   * @property {Course}
   */
  course: null,

  /**
   * @property {Profile[]} remixedUsers
   */
  remixedUsers: null,

  /**
   * @property {Profile[]} createdUsers
   */
  createdUsers: null,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('course.taxonomy.[]', function() {
    return TaxonomyTag.getTaxonomyTags(this.get("course.taxonomy"), false);
  }),

  isOwner: null


});
