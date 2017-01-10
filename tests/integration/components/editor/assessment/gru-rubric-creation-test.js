import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('editor/assessment/gru-rubric-creation', 'Integration | Component | editor/assessment/gru rubric creation', {
  integration: true
});

test('Rubric creation Layout', function(assert) {
  this.render(hbs`{{editor/assessment/gru-rubric-creation}}`);
  const $component = this.$();
  assert.ok($component.find('.gru-rubric-creation #from-web').length, 'Missing From Web Tab');
  assert.ok($component.find('.gru-rubric-creation #from-web .add-from-web .url-label').length, 'Missing URL label');
  assert.ok($component.find('.gru-rubric-creation #from-web .add-from-web .add-btn').length, 'Missing add button');
  var $fromComputerTab = $component.find('.gru-rubric-creation #from-web');
  assert.ok($fromComputerTab.length, 'Missing From Your Computer Tab');
  $fromComputerTab.click();
  return wait().then(function () {
    assert.ok($component.find('.gru-rubric-creation #from-computer .add-from-computer').length, 'Should switch to From Your Computer Tab');
  });
});
