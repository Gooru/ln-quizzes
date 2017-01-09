import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('editor/assessment/gru-rubric-creation', 'Integration | Component | editor/assessment/gru rubric creation', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{editor/assessment/gru-rubric-creation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#editor/assessment/gru-rubric-creation}}
      template block text
    {{/editor/assessment/gru-rubric-creation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
