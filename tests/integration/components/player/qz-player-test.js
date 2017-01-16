import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player/qz-player', 'Integration | Component | player/qz player', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{player/qz-player}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#player/qz-player}}
      template block text
    {{/player/qz-player}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
