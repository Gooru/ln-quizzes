import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:number-compare', 'Unit | Validator | number-compare', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
