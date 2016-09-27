import Ember from 'ember';
/**
 * Teacher Scale Indicator
 *
 * Component responsible for showing the Performance Scale Indicator in the teacher page.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  /**
   * Array that computes the elements class names to the specified strings in the array.
   *
   * @attribute {Array}
   */
  classNames:['gru-lesson-performance-container'],
  /**
   * Attribute that computes the element to the specified string.
   *
   * @attribute {String}
   */
  tagName:'div',

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Change the arrow's direction
     *
     * @function actions:selectUnit
     */
    selectLesson: function (lesson) {
      const component = this;
      if (component.isSelected()){
        this.get('onSelectLesson')();
      }
      else{
        this.get('onSelectLesson')(lesson.get('id'));
      }
    },

    /**
     * @function actions:selectResource
     * @param {string} collection - (collection/assessment)
     */
    selectResource: function (collection) {
      let lessonId = this.get("lesson.id");
      this.get('onSelectResource')(lessonId, collection);
    },

    /**
     * @function actions:viewReport
     * @param {string} collection - Identifier for a resource (collection/assessment)
     */
    viewReport: function (collection) {
      let lessonId = this.get("lesson.id");
      this.get('onViewReport')(lessonId, collection);
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didInsertElement:function(){
    this.toggleCollapse();
  },
  // -------------------------------------------------------------------------
  // Observers
  /**
   * Observes if the selection has changed
   */
  expandCollapse: Ember.observer("selectedLessonId", "lesson.id", function(){
    this.toggleCollapse();
  }),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * Selected option to show when on extra small
   *
   * @property {String}
   */
  selectedOption: null,
  /**
   *  Performance models for this lesson, unit, class, course and student
   *
   * @property {performance/performance}
   */
  lesson:null,
  /**
   * Number of the index of this lesson
   *
   * @property {Number}
   */
  localIndex:null,
  /**
   * Number of the index of this lessons data parent.
   *
   * @property {Number}
   */
  index:null,
  /**
   * UserID this user belongs to
   *
   * @property {String}
   */
  userId: null,

  /**
   * SelectedLessonId the currently selected lesson ID(Query Param)
   *
   * @property {String}
   */
  selectedLessonId: null,

  /**
   * Indicates if the current lesson is the selected one
   * @property {boolean} selected
   */
  selected: Ember.computed("selectedLessonId", "lesson.id", function(){
    return this.isSelected(); //calling the method because the property was not refreshed before events
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Toggles the collapse/expand
   */
  toggleCollapse: function(){
    let selected = this.isSelected();
    let collapsibleElement = Ember.$(this.element).find(".collections-container");
    collapsibleElement.collapse(selected ? "show" : "hide");
  },

  /**
   * Indicates if the current lesson is selected
   * This method was necessary because the ember computed was not refreshed before the event was trigger
   * @returns {boolean}
   */
  isSelected: function(){
    return this.get("selectedLessonId") === this.get("lesson.id");
  }
});
