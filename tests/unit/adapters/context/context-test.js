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

test('createContext', function(assert) {
  const adapter = this.subject();

  const routes = function() {
    this.post('/quizzes/api/v1/context', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({id:'77d0c04b-b71a-485b-9573-9101cc288a0f'})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };
  let data = {
    assignees: [
      {
        id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      }, {
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    contextData: {
      contextMap: {},
      metadata: {}
    },
    externalCollectionId: 'string',
    owner: {
      firstName: 'string',
      id: 'string',
      lastName: 'string',
      username: 'string'
    }
  };
  adapter.createContext(data)
    .then(response =>
      assert.deepEqual(response.id,'77d0c04b-b71a-485b-9573-9101cc288a0f', 'Wrong response')
    );
});

test('getContextsCreated', function(assert) {
  const adapter = this.subject();
  const routes = function() {
    this.get('/quizzes/api/v1/contexts/created', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify([{id:'77d0c04b-b71a-485b-9573-9101cc288a0f'}])];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };
  adapter.getContextsCreated()
    .then(response => assert.deepEqual(response.length,1, 'Wrong response'));
});

test('getReportData', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const routes = function() {
    this.get('/quizzes/api/v1/context/context-id/events', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter.getReportData(expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
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
    .then(response => assert.deepEqual(response, expectedResponse, 'Wrong response'));
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
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter.moveToResource(expectedResourceId, expectedContextId, expectedPreviousResource)
    .then(response => assert.deepEqual(response, expectedResponse, 'Wrong response'));
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
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter.moveToResource(expectedResourceId, expectedContextId, expectedPreviousResource)
    .then(response => assert.deepEqual(response, expectedResponse, 'Wrong response'));
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
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter.sendStartContextEvent(expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
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
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter.sendEndContextEvent(expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});

test('updateContext', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const routes = function() {
    this.put('/quizzes/api/v1/context/context-id', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  let data = {
    assignees: [
      {
        id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      }, {
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    contextData: {
      contextMap: {},
      metadata: {}
    },
    externalCollectionId: 'string',
    owner: {
      firstName: 'string',
      id: 'string',
      lastName: 'string',
      username: 'string'
    }
  };
  adapter.updateContext(data,expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});
