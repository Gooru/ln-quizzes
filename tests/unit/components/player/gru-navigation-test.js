import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('player/gru-navigation', 'Unit | Component | player/gru navigation', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('changeEmotion', function(assert) {
  let component = this.subject();
  component.set('sendAction', function(actionName, score) {
    assert.equal(actionName, 'onChangeEmotion', 'Action sent should match');
    assert.equal(score, 4, 'Emotion score should match');
  });
  component.send('changeEmotion', 4);
});

test('openNavigator', function(assert) {
  let component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onOpenNavigator', 'Action sent should match');
  });
  component.send('openNavigator');
});
