import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('qz-assessment-settings', 'Integration | Component | gru assessment settings', {
  integration: true
});

test('Layout', function(assert) {
  this.render(hbs`{{assignment/qz-assessment-settings}}`);

  var $settingsComponent = this.$();
  assert.equal($settingsComponent.find('.panel.assessment-settings').length,4, 'Should be 4 panel with settings');
  assert.ok($settingsComponent.find('.panel-body .bidirectional .instructions .backwards-header').length, 'Missing backwards header');
  assert.ok($settingsComponent.find('.panel-body .bidirectional .qz-switch .toggle').length, 'Backwards toggle button missing');
  assert.equal($settingsComponent.find('.panel-body .feedback .instructions span').length, 1, 'Feedback instructions missing');
  assert.equal($settingsComponent.find('.panel-body .feedback .gru-radio').length, 3, 'Feedback radio buttons');
  assert.ok($settingsComponent.find('.panel-body .answer-key .instructions span').length, 'Missing answer key instructions');
  assert.ok($settingsComponent.find('.panel-body .answer-key .qz-switch .toggle').length, 'Answer key toggle button');
  assert.ok($settingsComponent.find('.panel-body .attempts .instructions span').length, 'Missing attempts instructions');
  assert.ok($settingsComponent.find('.panel-body .attempts .gru-select').length, 'Attempts dropdown');
});