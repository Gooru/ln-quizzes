import Ember from "ember";
import ModalMixin from 'quizzes/mixins/modal';
/**
 * Class quick start controller
 *
 * Controller responsible of the logic for the class quick start page
 */
export default Ember.Controller.extend(ModalMixin,{

  // -------------------------------------------------------------------------
  // Dependencies
  classController: Ember.inject.controller('class'),

  classService: Ember.inject.service('api-sdk/class'),


  // -------------------------------------------------------------------------
  // Attributes


  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Properties

  class: null,
  courses: null,
  featuredCourses: null,
  modelForCoursesModal: Ember.computed('class', 'courses', function() {
    return Ember.Object.create({
      'classId': this.get('class.class.id'),
      'courses': this.get('courses')
    });
  }),
  modelForFeaturedCoursesModal: Ember.computed('class', 'featuredCourses', function(){
    return Ember.Object.create({
      'classId': this.get('class.class.id'),
      'courses': this.get('featuredCourses'),
      'areFeatured':true
    });
  })

  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods


});
