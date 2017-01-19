import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('editor/assessment/qz-category', 'Integration | Component | editor/assessment/qz category', {
  integration: true
});

test('Category Layout', function(assert) {
  var category = Ember.Object.create({
    title:'Category for test',
    feedbackGuidance:'Guidance for test',
    requiredFeedback:false
  });
  this.set('category',category);
  this.render(hbs`{{editor/assessment/qz-category category=category}}`);
  var $component = this.$();
  assert.ok($component.find('.editor.assessment.qz-category').length,'Category component missing');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category').length,'Missing category panel');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category .number').length,'Missing category number');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category .category-info').length,'Missing category information');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category .category-info .title').length,'Missing category title');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category .category-info .feedback-guidance').length,'Missing feedback guidance');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category .category-info .required-feedback').length,'Missing required feedback checkbox');
  assert.ok($component.find('.editor.assessment.qz-category .panel.category .category-info .scoring').length,'Missing scoring switch');
  assert.ok($component.find('.editor.assessment.qz-category .panel-footer .actions .btn.delete').length,'Missing delete category button');
  assert.ok($component.find('.editor.assessment.qz-category .panel-footer .actions .btn.copy').length,'Missing copy category button');
});
