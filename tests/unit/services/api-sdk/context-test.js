import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';
import Context from 'quizzes/models/context/context';
import Profile from 'quizzes/models/profile/profile';

moduleForService('service:api-sdk/context', 'Unit | Service | api-sdk/context', {

});
test('createContext', function(assert) {
  const service = this.subject();
  let assignment = Context.create({
    title:'title',
    description:'description',
    isActive:true,
    dueDate:'12340596',
    createdDate:'12340596',
    modifiedDate:'12340596',
    attempts:[{id:'attempt-1'}],
    learningObjective:'learning objective'
  });
  const expectedData = {
    "contextData": {
      "contextMap": {},
      "metadata": {
        title:'title',
        description:'description',
        isActive:true,
        dueDate:'12340596',
        createdDate:'12340596',
        modifiedDate:'12340596',
        attempts:[{id:'attempt-1'}],
        learningObjective:'learning objective'
      }
    }
  };

  assert.expect(2);

  service.set('contextAdapter', Ember.Object.create({
    createContext: function(data) {
      assert.equal(data, expectedData, "Wrong adapter data" );
      return Ember.RSVP.resolve();
    }
  }));
  service.set('contextSerializer', Ember.Object.create({
    serializeContext: function(assignment){
      assert.ok(assignment, 'Wrong assignment object');
      return expectedData;
    }
  }));

  var done = assert.async();
  service.createContext(assignment).then(function() { done(); });
});

test('getContextsCreated', function(assert) {
  const service = this.subject();
  const expectedResponse = {
    "assignees":[
      { id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      },{
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    "contextData": {
      "contextMap": {},
      "metadata": {
        title:'title',
        description:'description',
        isActive:true,
        dueDate:'12340596',
        createdDate:'12340596',
        modifiedDate:'12340596',
        attempts:[{id:'attempt-1'}],
        learningObjective:'learning objective'
      }
    }
  };
  const expectedData = [Context.create({
    assignees:[
      Profile.create({id: 'profile-id',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username'}),
      Profile.create({
      id: 'profile-id1',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1'
    })],
      title:'title',
      description:'description',
      isActive:true,
      dueDate:'12340596',
      createdDate:'12340596',
      modifiedDate:'12340596',
      attempts:[{id:'attempt-1'}],
      learningObjective:'learning objective'
  })];

  assert.expect(2);

  service.set('contextAdapter', Ember.Object.create({
    getContextsCreated: function() {
      assert.ok(true,"Wrong adapter" );
      return Ember.RSVP.resolve([{expectedResponse}]);
    }
  }));
  service.set('contextSerializer', Ember.Object.create({
    normalizeReadContexts: function(payload){
      assert.ok(payload, 'Wrong assignment object');
      return expectedData;
    }
  }));

  var done = assert.async();
  service.getContextsCreated().then(function() { done(); });
});

test('moveToResource', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const previousResult =  {
    id: 'result-id'
  };

  assert.expect(5);

  service.set('contextAdapter', Ember.Object.create({
    moveToResource: function(resourceId, contextId, previous) {
      assert.deepEqual(resourceId, expectedResourceId, 'The resource id should match');
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      assert.deepEqual(previous, previousResult, 'The previous result should match');
      return Ember.RSVP.resolve(previousResult);
    }
  }));

  service.set('contextSerializer', Ember.Object.create({
    serializeResourceResult: function(result) {
      assert.deepEqual(result, previousResult, 'The resource result should match');
      return previousResult;
    }
  }));

  var done = assert.async();
  service.moveToResource(expectedResourceId, expectedContextId, previousResult)
    .then(function(result) {
      assert.deepEqual(result, previousResult, 'The result should match');
      done();
    });
});


test('startContext', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const assessmentResult = {
    id: 'result-id'
  };

  assert.expect(3);

  service.set('contextAdapter', Ember.Object.create({
    sendStartContextEvent: function(contextId) {
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      return Ember.RSVP.resolve(assessmentResult);
    }
  }));

  service.set('contextSerializer', Ember.Object.create({
    normalizeAssessmentResult: function(response) {
      assert.deepEqual(response, assessmentResult, 'The assessment result should match');
      return assessmentResult;
    }
  }));

  var done = assert.async();
  service.startContext(expectedContextId)
    .then(function(result) {
      assert.deepEqual(result, assessmentResult, 'The result should match');
      done();
    });
});

test('endContext', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const assessmentResult = {
    id: 'result-id'
  };

  assert.expect(2);

  service.set('contextAdapter', Ember.Object.create({
    sendEndContextEvent: function(contextId) {
      assert.deepEqual(contextId, expectedContextId, 'The context id should match');
      return Ember.RSVP.resolve(assessmentResult);
    }
  }));

  var done = assert.async();
  service.endContext(expectedContextId)
    .then(function(result) {
      assert.deepEqual(result, assessmentResult, 'The result should match');
      done();
    });
});

test('updateContext', function(assert) {
  const service = this.subject();
  let assignment = Context.create({
    assignees:Ember.A([Profile.create({
      id: 'profile-id',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username'
    }),Profile.create({
      id: 'profile-id1',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1'
    })]),
    title:'title',
    description:'description',
    isActive:true,
    dueDate:'12340596',
    createdDate:'12340596',
    modifiedDate:'12340596'
  });
  const expectedData = {
    "assignees": [
      { id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      },{
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    "contextData": {
      "contextMap": {},
      "metadata": {}
    },
    "externalCollectionId": "string",
    "owner": {
      "firstName": "string",
      "id": "string",
      "lastName": "string",
      "username": "string"
    }
  };

  assert.expect(2);

  service.set('contextAdapter', Ember.Object.create({
    updateContext: function(data) {
      assert.equal(data, expectedData, "Wrong adapter data" );
      return Ember.RSVP.resolve();
    }
  }));

  let expectedAssigneesList = [
    Profile.create({
    id: 'profile-id',
    firstName: 'user first name',
    lastName: 'user last name',
    username: 'username'
  }),
    Profile.create({
    id: 'profile-id1',
    firstName: 'user first name1',
    lastName: 'user last name1',
    username: 'username1'
  })];

  service.set('contextSerializer', Ember.Object.create({
    serializeUpdateContext: function(assignment){
      assert.deepEqual(assignment.assignees, expectedAssigneesList, 'Wrong assignees list object');
      return expectedData;
    }
  }));

  var done = assert.async();
  service.updateContext(assignment).then(function() { done(); });
});
