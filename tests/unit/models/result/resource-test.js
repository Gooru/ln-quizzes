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

test('clear', function(assert) {
  let resourceResult = this.subject({
    savedTime: 20,
    startTime: 20,
    stopTime: 20,
    reaction: 2
  });
  resourceResult.clear();
  assert.equal(resourceResult.get('reaction'), 0, 'Wrong reaction');
  assert.equal(resourceResult.get('savedTime'), 0, 'Wrong saved time');
  assert.equal(resourceResult.get('startTime'), 0, 'Wrong start time');
  assert.equal(resourceResult.get('stopTime'), 0, 'Wrong stop time');
  assert.equal(resourceResult.get('timeSpent'), 0, 'Wrong time spent');

});
