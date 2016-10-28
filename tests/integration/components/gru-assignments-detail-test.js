import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assignments-detail', 'Integration | Component | gru assignments detail', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gru-assignments-detail}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gru-assignments-detail}}
      template block text
    {{/gru-assignments-detail}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
