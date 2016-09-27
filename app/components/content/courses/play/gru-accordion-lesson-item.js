import Ember from 'ember';

/**
 * Content Builder: Accordion Lesson Item
 *
 * Component responsible for presenting a collection/assessment within a lesson.
 * It is meant to be used inside of an {@link ./gru-accordion-unit|Accordion Lesson}
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend({


  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'courses', 'gru-accordion-lesson-item', 'view'],

  tagName: 'li',


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop {Content/Lesson} lesson
   */
  model: null

});
