import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assign-students', 'Integration | Component | gru assign students', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gru-assign-students}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gru-assign-students}}
      template block text
    {{/gru-assign-students}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
