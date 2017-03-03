import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForAdapter from 'dummy/tests/helpers/module-for-adapter';
import Configuration from 'quizzes-addon/config/env/test';

moduleForAdapter('adapter:collection/collection', 'Unit | Adapter | collection/collection');

test('readCollection', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  this.pretender.map(function() {
    this.get('/quizzes/api/v1/collections/collection-id', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  });
  adapter.readCollection('collection-id','collection')
    .then(response => assert.deepEqual({}, response, 'Wrong response'));
});
