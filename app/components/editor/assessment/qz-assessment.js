import Ember from 'ember';
import Category from 'quizzes/models/editor/assessment/category';
import Rubric from 'quizzes/models/editor/assessment/rubric';
/**
 *
 * Component for add/edit assessment
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Component.extend({
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['editor','assessment','qz-assessment'],

  // -------------------------------------------------------------------------
  // Actions
  actions:{
    /**
     * Add new category
     */
    addNewCategory:function(){
      let newCategory = Category.create({});
      let categories = this.get('categories');
      categories.addObject(newCategory);
    },
    /**
     *Set if feedback is required
     */
    setFeedBack: function(){
      this.set('assessment.requiredFeedback',!this.get('assessment.requiredFeedback'));
    },
    /**
     *Triggered by qz-category
     */
    deleteCategory:function(category){
      let categories = this.get('categories');
      categories.removeObject(category);
    }
  },

  // -------------------------------------------------------------------------
  // Properties
  assessment:Ember.Object.create({
    title:'',
    learningObjective:'',
    rubric:Rubric.create({}),
    totalPoints:0,
    feedbackGuidance:'',
    requiredFeedback:false
  }),
  /**
   * @property {Category[]} Temporal categories array
   */
  categories:Ember.computed('assessment.rubric.categories.[]',function(){
    let categories = Ember.A([Category.create({})]);
    if(this.get('assessment.rubric.categories.length')){
      //TODO return a copy of categories
      categories = this.get('assessment.rubric.categories');
    }
    return categories;
  }),

  /**
   * @property {Object[]} headerActions List of action buttons to show
   */
  headerActions: Ember.computed(function(){
    return [{
      name: 'delete',
      text: this.get('i18n').t('common.delete'),
      icon: 'delete'
    }, {
      name: 'copy',
      text: this.get('i18n').t('common.copy'),
      icon: 'content_copy'
    }, {
      name: 'preview',
      text: this.get('i18n').t('common.preview'),
      icon: 'remove_red_eye'
    }, {
      name: 'settings',
      text: this.get('i18n').t('common.settings'),
      icon: 'settings'
    }, {
      name: 'assign',
      text: this.get('i18n').t('common.assign-to-class'),
      icon: 'person_add'
    }];
  }),
  /**
   * @property {Object[]} headerActions List of action buttons to show
   */
  footerActions: Ember.computed(function(){
    return [{
      name: 'cancel',
      text: this.get('i18n').t('common.cancel'),
      class: 'btn-default'
    }, {
      name: 'save',
      text: this.get('i18n').t('common.save'),
      class: 'btn-primary'
    }];
  }),
  /**
   * @property {String} headerTitle
   */
  headerTitle: Ember.computed(function() {
    return this.get('i18n').t('common.add-assessment');
  }),

  /**
   * @property {Object[]} options List of tab options to show
   */
  options: Ember.computed(function(){
    return [{
      name: 'editor',
      text: this.get('i18n').t('common.editor')
    }, {
      name: 'information',
      text: this.get('i18n').t('common.information')
    }];
  }),


  /**
   * @property {String} selected Current option selected
   */
  selected: 'editor',
  /**
   * Indicate if is editing view
   */
  isEditing:true
});
