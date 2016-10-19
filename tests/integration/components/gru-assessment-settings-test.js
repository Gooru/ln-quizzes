import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assessment-settings', 'Integration | Component | gru assessment settings', {
  integration: true
});

test('Layout', function(assert) {
  this.render(hbs`{{gru-assessment-settings}}`);

  var $settingsComponent = this.$();
  assert.ok($settingsComponent.find('.header h2').length, "Section title");
  assert.ok($settingsComponent.find('.panel-heading h3').length, "Panel subtitle");
  assert.ok($settingsComponent.find('.panel-body .bidirectional .gru-switch .toggle').length, "Backwards toggle button");
  assert.equal($settingsComponent.find('.panel-body .feedback .gru-radio').length, 3, "Feedback radio buttons");
  assert.ok($settingsComponent.find('.panel-body .answer-key .gru-switch .toggle').length, "Answer key toggle button");
  assert.ok($settingsComponent.find('.panel-body .attempts .gru-select').length, "Attempts dropdown");

});
