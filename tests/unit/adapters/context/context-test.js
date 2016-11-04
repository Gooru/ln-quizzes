import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:context/context', 'Unit | Adapter | context/context', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('sendStartContextEvent', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const routes = function() {
    this.post('/quizzes/api/v1/context/context-id/event/start', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.sendStartContextEvent(expectedContextId)
    .then(function(response) {
      assert.deepEqual(response, {}, 'Wrong response');
    });
});

test('sendEndContextEvent', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const routes = function() {
    this.post('/quizzes/api/v1/context/context-id/event/end', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.sendEndContextEvent(expectedContextId)
    .then(function(response) {
      assert.deepEqual(response, {}, 'Wrong response');
    });
});
