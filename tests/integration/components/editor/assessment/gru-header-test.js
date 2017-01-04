import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('editor/assessment/gru-header', 'Integration | Component | editor/assessment/gru header', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{editor/assessment/gru-header}}`);

  assert.equal(this.$().text().trim(), '');
});
