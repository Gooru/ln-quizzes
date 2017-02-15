import { moduleFor, test } from 'ember-qunit';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';
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
    classId: 'class-id',
    collectionId: 'assessment-id',
    isCollection: true
  });
  const response = serializer.serializeContext(assignment);
  const expected = {
    classId: 'class-id',
    collectionId: 'assessment-id',
    isCollection: true,
    contextData: {
      metadata: {
        description: 'description',
        title: 'title'
      }
    }
  };
  assert.deepEqual(expected, response, 'serializeAssignment wrong response');
});

test('serializeUpdateContext', function(assert) {
  const serializer = this.subject();
  const assignment = Context.create({
    title: 'title',
    description: 'description',
    collectionId: 'assessment-id'
  });
  const response = serializer.serializeUpdateContext(assignment);
  const expected = {
    contextData: {
      metadata: {
        title: 'title',
        description: 'description'
      }
    }
  };
  assert.deepEqual(expected, response, 'Serialize update assignment wrong response');
});

test('normalizeContextResult', function(assert) {
  const serializer = this.subject();
  const payload = {
    contextId: 'context-id',
    currentResourceId: 'resource-id-2',
    collectionId: 'collection-id',
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

test('normalizeReadContext', function(assert) {
  const serializer = this.subject();
  const payload = {
    contextId: 'assignment-id',
    classId: 'class-id',
    contextData: {
      metadata: {
        title: 'title',
        description: 'description'
      }
    },
    collectionId: 'assessment-id',
    isCollection: true
  };
  const response = serializer.normalizeReadContext(payload);
  assert.equal(response.get('id'), 'assignment-id', 'Wrong context id');
  assert.equal(response.get('title'), 'title', 'Wrong title value');
  assert.equal(response.get('description'), 'description', 'Wrong description value');
  assert.equal(response.get('classId'), 'class-id', 'Wrong class id value');
  assert.equal(response.get('isCollection'), true, 'Wrong isCollection value');
  assert.equal(response.get('collectionId'), 'assessment-id', 'Wrong collectionId value');
});

test('normalizeReadContexts', function(assert) {
  const serializer = this.subject();
  const payload = [{
    contextId: 'assignment-id',
    classId: 'class-id',
    contextData: {
      metadata: {
        title: 'title',
        description: 'description'
      }
    },
    collectionId: 'assessment-id',
    isCollection: true
  }];
  const response = serializer.normalizeReadContexts(payload);
  assert.equal(response.length, 1, 'The array should have 1 context');
  assert.equal(response[0].get('id'), 'assignment-id', 'Wrong context id');
  assert.equal(response[0].get('title'), 'title', 'Wrong title value');
  assert.equal(response[0].get('description'), 'description', 'Wrong description value');
  assert.equal(response[0].get('classId'), 'class-id', 'Wrong class id value');
  assert.equal(response[0].get('isCollection'), true, 'Wrong isCollection value');
  assert.equal(response[0].get('collectionId'), 'assessment-id', 'Wrong collectionId value');
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
