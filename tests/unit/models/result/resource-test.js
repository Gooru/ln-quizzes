import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/resource', 'Unit | Model | result/resource');

test('timeSpent', function(assert) {
  let resourceResult = this.subject({
    savedTime: 0,
    startTime: 0,
    stopTime: 20
  });
  assert.equal(resourceResult.get('timeSpent'), 20, 'Wrong time spent');

  resourceResult.set('startTime', 10);
  assert.equal(resourceResult.get('timeSpent'), 10, 'Wrong time spent');

  resourceResult.set('savedTime', 50);
  assert.equal(resourceResult.get('timeSpent'), 60, 'Wrong time spent');
});
