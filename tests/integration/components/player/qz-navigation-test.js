import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'player/qz-navigation',
  'Integration | Component | player/qz navigation',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Not submitted layout', function(assert) {
  assert.expect(1);

  const collection = Ember.Object.create({
    isAssessment: true
  });

  this.set('collection', collection);
  this.render(hbs`{{player/qz-navigation collection=collection}}`);

  var $component = this.$(); //component dom element
  const $navigation = $component.find('.qz-navigation');
  T.exists(assert, $navigation, 'Missing navigation section');
});

test('Submitted layout', function(assert) {
  assert.expect(2);

  const collection = Ember.Object.create({
    isAssessment: true
  });

  this.set('collection', collection);
  this.render(
    hbs`{{player/qz-navigation submitted=true collection=collection}}`
  );

  var $component = this.$(); //component dom element
  const $navigation = $component.find('.qz-navigation');
  T.exists(assert, $navigation, 'Missing navigation section');
  T.notExists(
    assert,
    $navigation.find('button.finish-collection'),
    'Finish collection button should be hidden'
  );
});

test('Layout when navigator is opened', function(assert) {
  assert.expect(1);

  this.on('parentAction', function() {
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/qz-navigation onOpenNavigator='parentAction'}}`);
  var $component = this.$(); //component dom element
  var $menuButton = $component.find('.navigation-bar span');

  assert.ok($menuButton, 'Missing menu button');
  $menuButton.click();
});
