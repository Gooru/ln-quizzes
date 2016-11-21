import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('gru-slide-up-menu', 'Unit | Component | gru slide up menu', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('closeMenu', function(assert) {
  let component = this.subject();
  component.set('visible', true);
  component.set('actions.closeMenu', function() {
    assert.ok(true,'Should be called');
  });
  component.send('closeMenu');
});
