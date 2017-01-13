import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';
import Profile from 'quizzes/models/profile/profile';
import Context from 'quizzes/models/context/context';

moduleFor('serializer:context/context', 'Unit | Serializer | context/context');

test('serializeResourceResult with a resource', function(assert) {
  const serializer = this.subject();
  const resourceResult = ResourceResult.create({
    resourceId: 'resource-id',
    savedTime: 20,
    startTime: 10,
    stopTime: 20000,
    reaction: 2
  });
  const response = serializer.serializeResourceResult(resourceResult);
  const expected = {
    resourceId: 'resource-id',
    timeSpent: 20010,
    reaction: 2
  };

  assert.deepEqual(expected, response, 'Wrong response');
});

test('serializeResourceResult with a question', function(assert) {
  const serializer = this.subject();
  const questionResult = QuestionResult.create({
    resourceId: 'resource-id',
    startTime: 10,
    stopTime: 10010,
    reaction: 2,
    answer: [{
      value: 'answer'
    }]
  });
  const response = serializer.serializeResourceResult(questionResult);
  const expected = {
    resourceId: 'resource-id',
    timeSpent: 10000,
    reaction: 2,
    answer: [{
      value: 'answer'
    }]
  };
  assert.deepEqual(expected, response, 'Wrong response');
});
test('serializeContext', function(assert) {
  const serializer = this.subject();
  const assignment = Context.create({
    id: 'assignment-id',
    title: 'title',
    description: 'description',
    isActive: true,
    dueDate: 12340596,
    availableDate: 12340596,
    createdDate: 12340596,
    modifiedDate: 12340596,
    learningObjective: 'learning objective',
    owner: Profile.create({
      id: 'teacher-id',
      externalId:'externalId',
      firstName: 'teacher first name',
      lastName: 'teacher last name',
      username: 'usernameT',
      email:'email@email.com'
    }),
    externalCollectionId: 'assessment-id',
    assignees: Ember.A([
      Profile.create({
        id: 'profile-id',
        externalId:'externalId',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username',
        email:'email@email.com'
      }),
      Profile.create({
        id: 'profile-id1',
        externalId:'externalId',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1',
        email:'email@email.com'
      })
    ])
  });
  const response = serializer.serializeContext(assignment);
  const expected ={
    assignees: [
      {
        email: 'email@email.com',
        firstName: 'user first name',
        id: 'externalId',
        lastName: 'user last name',
        username: 'username'
      },
      {
        email: 'email@email.com',
        firstName: 'user first name1',
        id: 'externalId',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    contextData: {
      metadata: {
        description: 'description',
        dueDate: 12340596,
        isActive: true,
        learningObjective: 'learning objective',
        startDate: 12340596,
        title: 'title'
      }
    },
    createdDate: 12340596,
    modifiedDate: 12340596,
    externalCollectionId: 'assessment-id',
    owner: {
      email: 'email@email.com',
      externalId: 'externalId',
      firstName: 'teacher first name',
      id: 'teacher-id',
      lastName: 'teacher last name',
      username: 'usernameT'
    }
  };
  assert.deepEqual(expected, response, 'serializeAssignment wrong response');
});

test('serializeUpdateContext', function(assert) {
  const serializer = this.subject();
  const assignment = Context.create({
    title: 'title',
    description: 'description',
    isActive: true,
    dueDate: 12340596,
    availableDate:12340596,
    createdDate: 12340596,
    modifiedDate: 12340596,
    learningObjective: 'learning objective',
    owner: Profile.create({
      externalId:'externalId',
      firstName: 'teacher first name',
      lastName: 'teacher last name',
      username: 'usernameT',
      email:'email@email.com'
    }),
    externalCollectionId: 'assessment-id',
    assignees: Ember.A([
      Profile.create({
        externalId:'externalId',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username',
        email:'email@email.com'
      }),
      Profile.create({
        externalId:'externalId',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1',
        email:'email@email.com'
      })
    ])
  });
  const response = serializer.serializeUpdateContext(assignment);
  const expected ={
    assignees: [{
      id: 'externalId',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username',
      email:'email@email.com'
    }, {
      id: 'externalId',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1',
      email:'email@email.com'
    }],
    contextData: {
      metadata: {
        title: 'title',
        description: 'description',
        isActive: true,
        dueDate: 12340596,
        startDate: 12340596,
        learningObjective: 'learning objective'
      }
    },
    createdDate: 12340596,
    modifiedDate: 12340596
  };
  assert.deepEqual(expected, response, 'Serialize update assignment wrong response');
});

test('serializeAssigneesList ', function(assert) {
  const serializer = this.subject();
  const profileList = Ember.A([
    Profile.create({
      externalId:'externalId',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username',
      email:'email@email.com'
    }),
    Profile.create({
      externalId:'externalId',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1',
      email:'email@email.com'
    })
  ]);
  const response = serializer.serializeAssigneesList(profileList);
  const expected = [{
    id: 'externalId',
    firstName: 'user first name',
    lastName: 'user last name',
    username: 'username',
    email:'email@email.com'
  }, {
    id: 'externalId',
    firstName: 'user first name1',
    lastName: 'user last name1',
    username: 'username1',
    email:'email@email.com'
  }];
  assert.deepEqual(expected, response, 'serializeAssigneesList wrong response');
});

test('normalizeContextResult', function(assert) {
  const serializer = this.subject();
  const payload = {
    id: 'context-id',
    currentResourceId: 'resource-id-2',
    collection: {
      id: 'collection-id'
    },
    events: [{
      resourceId: 'resource-id-1',
      timeSpent: 10000,
      reaction: 1,
      answer: 'answer-1'
    }, {
      resourceId: 'resource-id-2',
      timeSpent: 20000,
      reaction: 3,
      answer: 'answer-2'
    }]
  };
  const response = serializer.normalizeContextResult(payload);
  assert.equal(response.get('contextId'), 'context-id', 'Wrong context id value');
  assert.equal(response.get('collectionId'), 'collection-id', 'Wrong collection id value');
  assert.equal(response.get('currentResourceId'), 'resource-id-2', 'Wrong current resource id value');
  assert.equal(response.get('resourceResults').length, 2, 'Wrong resource results length');
  assert.equal(response.get('resourceResults')[0].get('answer'), 'answer-1', 'Wrong first answer');
  assert.equal(response.get('resourceResults')[0].get('reaction'), 1, 'Wrong first reaction');
  assert.equal(response.get('resourceResults')[0].get('resourceId'), 'resource-id-1', 'Wrong first resource id');
  assert.equal(response.get('resourceResults')[0].get('savedTime'), 10000, 'Wrong first time spent');
  assert.equal(response.get('resourceResults')[1].get('answer'), 'answer-2', 'Wrong second answer');
  assert.equal(response.get('resourceResults')[1].get('reaction'), 3, 'Wrong second reaction');
  assert.equal(response.get('resourceResults')[1].get('resourceId'), 'resource-id-2', 'Wrong second resource id');
  assert.equal(response.get('resourceResults')[1].get('savedTime'), 20000, 'Wrong second time spent');
});

test('normalizeAssigneesList', function(assert) {
  const serializer = this.subject();
  const payload = [{
    id: 'id-1',
    firstName: 'firstname1',
    lastName: 'lastname1',
    username: 'username1',
    email:'email@email.com'
  }, {
    id: 'id-2',
    firstName: 'firstname2',
    lastName: 'lastname2',
    username: 'username2',
    email:'email@email.com'
  }];
  const response = serializer.normalizeAssigneesList(payload);
  assert.equal(response[0].get('id'), 'id-1', 'Wrong context id value');
  assert.equal(response[0].get('firstName'), 'firstname1', 'Wrong first name value');
  assert.equal(response[0].get('lastName'), 'lastname1', 'Wrong last name value');
  assert.equal(response[0].get('username'), 'username1', 'Wrong username value');
});

test('normalizeReadContext', function(assert) {
  const serializer = this.subject();
  const payload = {
    id: 'assignment-id',
    assignees: [{
      id: 'profile-id',
      externalId:'externalId',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username',
      email:'email@email.com'
    }, {
      id: 'profile-id1',
      externalId:'externalId',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1',
      email:'email@email.com'
    }],
    contextData: {
      metadata: {
        title: 'title',
        description: 'description',
        isActive: true,
        dueDate: 12340596,
        startDate: 12340596,
        learningObjective: 'learning objective'
      }
    },
    createdDate: 12340596,
    modifiedDate: 12340596,
    collection: {
      id: 'collection-id'
    },
    externalCollectionId: 'assessment-id',
    owner: {
      firstName: 'ownerFirstname',
      id: 'owner-id',
      lastName:'ownerLastname',
      username: 'ownerUsername',
      email:'email@email.com'
    }
  };
  const response = serializer.normalizeReadContext(payload);
  assert.equal(response.get('title'), 'title', 'Wrong title value');
  assert.equal(response.get('description'), 'description', 'Wrong description value');
  assert.equal(response.get('isActive'), true , 'Wrong isActive value');
  assert.equal(response.get('dueDate'), 12340596, 'Wrong dueDate value');
  assert.equal(response.get('availableDate'), 12340596, 'Wrong dueDate value');
  assert.equal(response.get('createdDate'), 12340596, 'Wrong createdDate value');
  assert.equal(response.get('modifiedDate'), 12340596, 'Wrong modifiedDate value');
  assert.equal(response.get('learningObjective'), 'learning objective', 'Wrong learningObjective value');
  assert.equal(response.get('externalCollectionId'), 'assessment-id', 'Wrong collectionId value');
  assert.equal(response.get('owner.firstName'), 'ownerFirstname', 'Wrong owner fist name value');
  assert.equal(response.get('owner.id'), 'owner-id', 'Wrong owner id value');
  assert.equal(response.get('owner.lastName'), 'ownerLastname', 'Wrong last name value');
  assert.equal(response.get('owner.username'), 'ownerUsername', 'Wrong username value');
  assert.equal(response.get('collection.id'), 'collection-id', 'Wrong username value');
});

test('normalizeReadContexts', function(assert) {
  const serializer = this.subject();
  const payload = [{
    assignees: [{
      id: 'profile-id',
      externalId:'externalId',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username',
      email:'email@email.com'
    }, {
      id: 'profile-id1',
      externalId:'externalId',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1',
      email:'email@email.com'
    }],
    contextData: {
      metadata: {
        title: 'title',
        description: 'description',
        isActive: true,
        dueDate: 12340596,
        startDate: 12340596,
        learningObjective: 'learning objective'
      }
    },
    createdDate: 12340596,
    modifiedDate: 12340596,
    collection: {
      id: 'collection-id'
    },
    externalCollectionId: 'assessment-id',
    owner: {
      firstName: 'ownerFirstname',
      id: 'owner-id',
      lastName:'ownerLastname',
      username: 'ownerUsername',
      email:'email@email.com'
    }
  }];
  const response = serializer.normalizeReadContexts(payload);
  assert.equal(response.length, 1, 'The array should have 1 context');
  assert.equal(response[0].get('title'), 'title', 'Wrong title value');
  assert.equal(response[0].get('description'), 'description', 'Wrong description value');
  assert.equal(response[0].get('isActive'), true , 'Wrong isActive value');
  assert.equal(response[0].get('dueDate'), 12340596, 'Wrong dueDate value');
  assert.equal(response[0].get('availableDate'), 12340596, 'Wrong dueDate value');
  assert.equal(response[0].get('createdDate'), 12340596, 'Wrong createdDate value');
  assert.equal(response[0].get('modifiedDate'), 12340596, 'Wrong modifiedDate value');
  assert.equal(response[0].get('learningObjective'), 'learning objective', 'Wrong learningObjective value');
});

test('normalizeResourceResults', function(assert) {
  const serializer = this.subject();
  const payload = [{
    resourceId: 'resource-id-1',
    timeSpent: 10000,
    reaction: 1,
    score: 100,
    isSkipped: false,
    answer: 'answer-1'
  }, {
    resourceId: 'resource-id-2',
    timeSpent: 20000,
    reaction: 3,
    score: 0,
    isSkipped: true,
    answer: 'answer-2'
  }];
  const response = serializer.normalizeResourceResults(payload);
  assert.equal(response.length, 2, 'Wrong resource results length');
  assert.equal(response[0].get('answer'), 'answer-1', 'Wrong first answer');
  assert.equal(response[0].get('reaction'), 1, 'Wrong first reaction');
  assert.equal(response[0].get('resourceId'), 'resource-id-1', 'Wrong first resource id');
  assert.equal(response[0].get('savedTime'), 10000, 'Wrong first time spent');
  assert.equal(response[0].get('score'), 100, 'Wrong first score');
  assert.notOk(response[0].get('skipped'), 'Wrong first skipped value');
  assert.equal(response[1].get('answer'), 'answer-2', 'Wrong second answer');
  assert.equal(response[1].get('reaction'), 3, 'Wrong second reaction');
  assert.equal(response[1].get('resourceId'), 'resource-id-2', 'Wrong second resource id');
  assert.equal(response[1].get('savedTime'), 20000, 'Wrong second time spent');
  assert.equal(response[1].get('score'), 0, 'Wrong second score');
  assert.ok(response[1].get('skipped'), 'Wrong second skipped value');
});

test('normalizeReportData', function(assert) {
  const serializer = this.subject();
  const payload = {
    contextId: 'context-id',
    collection: {
      id: 'collection-id'
    },
    profileEvents: [{
      currentResourceId: 'current-resource-id',
      profileId: 'student-id-1',
      events: [{
        resourceId: 'resource-id-1',
        timeSpent: 10000,
        reaction: 1,
        answer: 'answer-1'
      }, {
        resourceId: 'resource-id-2',
        timeSpent: 20000,
        reaction: 3,
        answer: 'answer-2'
      }]
    }, {
      currentResourceId: 'current-resource-id',
      profileId: 'student-id-2',
      profileCode: 'student-code-2',
      profileName: 'student-name-2',
      events: []
    }]
  };
  const response = serializer.normalizeReportData(payload);
  assert.equal(response.get('contextId'), 'context-id', 'Wrong context id value');
  assert.equal(response.get('collectionId'), 'collection-id', 'Wrong collection id value');
  assert.equal(response.get('reportEvents').length, 2, 'Wrong resource results length');
});

test('normalizeReportEvents', function(assert) {
  const serializer = this.subject();
  const payload = [{
    currentResourceId: 'current-resource-id',
    profileId: 'student-id-1',
    events: [{
      resourceId: 'resource-id-1',
      timeSpent: 10000,
      reaction: 1,
      answer: 'answer-1'
    }, {
      resourceId: 'resource-id-2',
      timeSpent: 20000,
      reaction: 3,
      answer: 'answer-2'
    }]
  }, {
    currentResourceId: 'current-resource-id',
    profileId: 'student-id-2',
    events: []
  }];
  const response = serializer.normalizeReportDataEvents(payload);
  assert.equal(response.length, 2, 'Wrong resource results length');
  assert.equal(response[0].get('currentResourceId'), 'current-resource-id', 'Wrong first current resource');
  assert.equal(response[0].get('profileId'), 'student-id-1', 'Wrong first student id');
  assert.equal(response[0].get('resourceResults').length, 2, 'Wrong first results length');
  assert.equal(response[0].get('resourceResults')[0].get('resourceId'), 'resource-id-1', 'Wrong first resource id');
  assert.equal(response[0].get('resourceResults')[1].get('resourceId'), 'resource-id-2', 'Wrong second resource id');
  assert.equal(response[1].get('currentResourceId'), 'current-resource-id', 'Wrong second current resource');
  assert.equal(response[1].get('profileId'), 'student-id-2', 'Wrong second student id');
  assert.equal(response[1].get('resourceResults').length, 0, 'Wrong second results length');
});
