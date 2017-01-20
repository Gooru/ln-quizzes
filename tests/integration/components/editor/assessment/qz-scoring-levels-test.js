import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('editor/assessment/qz-scoring-levels', 'Integration | Component | editor/assessment/qz scoring levels', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{editor/assessment/qz-scoring-levels}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#editor/assessment/qz-scoring-levels}}
      template block text
    {{/editor/assessment/qz-scoring-levels}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
