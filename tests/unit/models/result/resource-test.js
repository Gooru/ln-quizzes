import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/resource', 'Unit | Model | result/resource');

test('timeSpent', function(assert) {
  let resourceResult = this.subject({
    savedTime: 0,
    startTime: 0,
    stopTime: 2000
  });
  assert.equal(resourceResult.get('timeSpent'), 2000, 'Wrong time spent');

  resourceResult.set('startTime', 1000);
  assert.equal(resourceResult.get('timeSpent'), 1000, 'Wrong time spent');

  resourceResult.set('savedTime', 5000);
  assert.equal(resourceResult.get('timeSpent'), 6000, 'Wrong time spent');
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

test('roundMilliseconds', function(assert) {
  const component = this.subject();
  assert.equal(component.roundMilliseconds(445010), 445000, 'Wrong rounded');
});
