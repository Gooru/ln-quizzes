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

test('moveToResource', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const expectedPreviousResource = {
    id: 'id'
  };
  const expectedResponse = {};
  const routes = function() {
    this.post('/quizzes/api/v1/context/context-id/event/on-resource/resource-id', function(request) {
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

test('moveToResource no resource', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = null;
  const expectedPreviousResource = {
    id: 'id'
  };
  const expectedResponse = {};
  const routes = function() {
    this.post('/quizzes/api/v1/context/context-id/event/on-resource/', function(request) {
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

test('moveToResource no previous resource', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = null;
  const expectedPreviousResource = null;
  const expectedResponse = {};
  const routes = function() {
    this.post('/quizzes/api/v1/context/context-id/event/on-resource/', function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.notOk(requestBodyJson.previousResource, 'Wrong previous resource');
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
