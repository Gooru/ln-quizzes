import Ember from 'ember';
import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';
import Configuration from 'quizzes-addon/config/env/test';

moduleFor('adapter:resource/resource', 'Unit | Adapter | resource/resource', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('readResource', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });

  const routes = function() {
    this.get('/api/nucleus/v1/resources/resource-id',
      () => [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          id: 'resource-id'
        })
      ], false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  adapter.readResource('resource-id')
    .then(response =>
      assert.deepEqual(response.id, 'resource-id', 'Wrong response')
    );
});
