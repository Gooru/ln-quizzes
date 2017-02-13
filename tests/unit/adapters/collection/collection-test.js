import { test } from 'ember-qunit';
import moduleForAdapter from 'quizzes/tests/helpers/module-for-adapter';

moduleForAdapter('adapter:collection/collection', 'Unit | Adapter | collection/collection', {
});

test('readCollection', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get('/quizzes/api/v1/collections/collection-id', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  });
  adapter.readCollection('collection-id')
    .then(response => assert.deepEqual({}, response, 'Wrong response'));
});
