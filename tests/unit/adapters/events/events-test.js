import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:events/events', 'Unit | Adapter | events/events', {
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
    this.post('/quizzes/api/v1/event/start/context/context-id', function() {
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
    this.post('/quizzes/api/v1/event/end/context/context-id', function() {
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

test('moveToResource', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const expectedPreviousResource = {
    id: 'id'
  };
  const expectedResponse = {};
  const routes = function() {
    this.post('/quizzes/api/v1/event/on-resource/resource-id/context/context-id', function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.deepEqual(requestBodyJson.previousResource, expectedPreviousResource, 'Wrong previous resource');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify(expectedResponse)];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.moveToResource(expectedResourceId, expectedContextId, expectedPreviousResource)
    .then(function(response) {
      assert.deepEqual(response, expectedResponse, 'Wrong response');
    });
});
