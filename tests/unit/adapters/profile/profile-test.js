import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForAdapter from 'quizzes/tests/helpers/module-for-adapter';
import EndPointsConfig from 'quizzes/utils/endpoint-config';

moduleForAdapter('adapter:profile/profile', 'Unit | Adapter | profile/profile', {
  // needs: []
});

test('createProfile', function(assert) {
  const adapter = this.subject();
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const data = {
    body: {}
  };
  const routes = function() {
    const endpointUrl = EndPointsConfig.getEndpointSecureUrl();
    this.post(`${endpointUrl}/api/nucleus-auth/v1/users`, function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.createProfile(data)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('updateMyProfile', function(assert) {
  const adapter = this.subject();
  const profile = Ember.Object.create({
    id: "user-id"
  });
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const data = {
    body: profile
  };
  const routes = function() {
    this.put('/api/nucleus-auth/v1/users/me', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.updateMyProfile(data)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('readUserProfile', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.get('/api/nucleus/v1/profiles/user-id/demographics', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readUserProfile(userId)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('readUserProfileByUsername', function(assert) {
  assert.expect(2);

  const adapter = this.subject();
  const username = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));

  const routes = function() {
    //serving get profile request for userId 100
    this.get('/api/nucleus/v1/profiles/100/demographics', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);

    //serving get user by username
    this.get('/api/nucleus-auth/v1/users', function(request) {
      assert.equal(request.queryParams.username, "user-id", "Wrong username parameter");
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({ id: "100" })];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readUserProfileByUsername(username)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('followUserProfile', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.post('/api/nucleus/v1/profiles/follow', function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.equal('user-id', requestBodyJson['user_id']);
      return [200, {'Content-Type': 'application/json'}, {}];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.followUserProfile(userId)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('unfollowUserProfile', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.delete('/api/nucleus/v1/profiles/user-id/unfollow', function() {
      return [200, {'Content-Type': 'text/plain'}, ""];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.unfollowUserProfile(userId)
    .then(function(response) {
      assert.equal("", response, 'Wrong response');
    });
});


test('readResources', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.get('/api/nucleus/v1/profiles/user-id/resources', function(request) {
      assert.equal(request.queryParams['limit'], '50', 'Wrong limit');
      assert.equal(request.queryParams['offset'], '100', 'Wrong offset');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readResources(userId, { page: 2 })
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('readQuestions', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.get('/api/nucleus/v1/profiles/user-id/questions', function(request) {
      assert.equal(request.queryParams['limit'], '50', 'Wrong limit');
      assert.equal(request.queryParams['offset'], '100', 'Wrong offset');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readQuestions(userId, { page: 2 })
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});


test('readCollections', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.get('/api/nucleus/v1/profiles/user-id/collections', function(request) {
      assert.equal(request.queryParams['limit'], '50', 'Wrong limit');
      assert.equal(request.queryParams['offset'], '100', 'Wrong offset');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readCollections(userId, { page: 2 })
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('readAssessments', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.get('/api/nucleus/v1/profiles/user-id/assessments', function(request) {
      assert.equal(request.queryParams['limit'], '50', 'Wrong limit');
      assert.equal(request.queryParams['offset'], '100', 'Wrong offset');
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readAssessments(userId, { page: 2 })
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('readNetwork', function(assert) {
  const adapter = this.subject();
  const userId = "user-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.get('/api/nucleus/v1/profiles/user-id/network', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readNetwork(userId, '')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('forgotPassword', function(assert) {
  const adapter = this.subject();
  const email = "email-id";
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    this.post('/api/nucleus-auth/v1/users/password-reset', function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.equal(email, requestBodyJson['email_id']);
      return [200, {'Content-Type': 'application/json'}, {}];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.forgotPassword(email)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('resetPassword', function(assert) {
  const adapter = this.subject();
  const userId = 'user-id';
  const password = 'password';
  const token = 'token';
  adapter.set('session', Ember.Object.create({
    'token-api3': 'token-api-3'
  }));
  const routes = function() {
    const endpointUrl = EndPointsConfig.getEndpointSecureUrl();
    this.put(`${endpointUrl}/api/nucleus-auth/v1/users/user-id/password`, function(request) {
      let requestBodyJson = JSON.parse(request.requestBody);
      assert.equal(password, requestBodyJson['new_password']);
      assert.equal(token, requestBodyJson['token']);
      return [200, {'Content-Type': 'application/json'}, {}];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.resetPassword(userId, password, token)
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});
