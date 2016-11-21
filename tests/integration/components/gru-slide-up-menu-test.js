import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('gru-slide-up-menu', 'Integration | Component | gru slide up menu', {
  integration: true
});

test('Slide menu not visible', function(assert) {
  this.render(hbs`{{gru-slide-up-menu}}`);
  var $slideMenu = this.$().find('.gru-slide-up-menu');
  assert.ok($slideMenu.hasClass('hide'), 'Slide up menu should be hide');
});

test('Slide menu visible', function(assert) {
  this.set('visible',true);

  this.render(hbs`{{gru-slide-up-menu visible=visible}}`);

  var $slideMenu = this.$().find('.gru-slide-up-menu');
  assert.notOk($slideMenu.hasClass('hide'), 'Slide up menu should be visible');
  assert.ok($slideMenu.find('.disabled').length, 'Should have disabled section');
});
