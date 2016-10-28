import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assignments-table', 'Integration | Component | gru assignments table', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gru-assignments-table}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gru-assignments-table}}
      template block text
    {{/gru-assignments-table}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
