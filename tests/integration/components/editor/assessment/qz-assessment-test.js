import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('editor/assessment/qz-assessment', 'Integration | Component | editor/assessment/qz assessment', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{editor/assessment/qz-assessment}}`);
  var $component = this.$();
  assert.ok($component.find('.editor.assessment.qz-assessment').length,'Assessment component should appear');

});


test('Overall Score Layout', function(assert) {

  this.render(hbs`{{editor/assessment/qz-assessment}}`);
  var $component = this.$();
  assert.ok($component.find('.editor.assessment.qz-assessment .overall-score').length,'Missing overall score panel');
  assert.ok($component.find('.editor.assessment.qz-assessment .overall-score .panel-heading h3').length,'Missing overall score title');
  assert.ok($component.find('.editor.assessment.qz-assessment .overall-score .panel-body .feedback label span').length,'Missing Feedback guidance label');
  assert.ok($component.find('.editor.assessment.qz-assessment .overall-score .panel-body .feedback label .gru-textarea').length,'Missing Feedback guidance textarea');
  assert.ok($component.find('.editor.assessment.qz-assessment .overall-score .panel-body .total-points').length,'Missing total points');
  assert.ok($component.find('.editor.assessment.qz-assessment .overall-score .panel-body .required-feedback span').length,'Missing required feedback checkbox');
});
