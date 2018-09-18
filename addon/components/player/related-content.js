import Ember from 'ember';

/**
 * Related Content
 *
 * Component responsible for showing related content.
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['related-content'],

  // -------------------------------------------------------------------------
  // Properties

  showRelatedContent: false,

  /**
   * @property {Array} list of suggested resources of a collection
   */
  suggestedResources: null,

  /**
   * @property {String} classId - Class unique Id associated for the collection / assessment.
   */
  classId: null,

  /**
   * @property {String} courseId - course unique Id associated for the collection / assessment.
   */
  courseId: null,

  /**
   * @property {String} collectionUrl
   */
  collectionUrl: null,

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user click related content tab.
     */
    onToggleRelatedContent() {
      this.toggleProperty('showRelatedContent');
    },

    /**
     * Action triggered when the user play a resource
     */
    onPlayResource(resource) {
      let collectionUrl = window.location.href;
      if (!this.get('collectionUrl')) {
        this.set('collectionUrl', collectionUrl);
      }
      let queryParams = {
        collectionUrl: this.get('collectionUrl')
      };
      let classId = this.get('classId');
      if (classId) {
        queryParams.classId = classId;
      }
      this.get('router').transitionTo(
        'resource-player',
        this.get('courseId'),
        resource.id,
        {
          queryParams
        }
      );
    }
  },

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Methods

  //--------------------------------------------------------------------------
  // Observer

  onChange: Ember.observer('showRelatedContent', function() {
    if (this.get('showRelatedContent')) {
      let component = this;
      component.$().animate(
        {
          bottom: '50px'
        },
        {
          complete: function() {
            component.$().css('bottom', '50px');
          }
        }
      );
    } else {
      let component = this;
      let bottom = -384;
      component.$().animate(
        {
          bottom: `${bottom}px`
        },
        {
          complete: function() {
            component.$().css('bottom', '-384px');
          }
        }
      );
    }
  })
});