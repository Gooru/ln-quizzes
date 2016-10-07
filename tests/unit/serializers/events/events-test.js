import { moduleFor, test } from 'ember-qunit';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';

moduleFor('serializer:events/events', 'Unit | Serializer | events/events');

test('serializeResourceResult with a resource', function(assert) {
  const serializer = this.subject();
  const resourceResult = ResourceResult.create({
    resourceId: 'resource-id',
    timeSpent: 10000,
    reaction: 2
  });
  const response = serializer.serializeResourceResult(resourceResult);
  const expected = {
    resourceId: 'resource-id',
    timeSpent: 10000,
    reaction: 2
  };

  assert.deepEqual(expected, response, 'Wrong response');
});

test('serializeResourceResult with a question', function(assert) {
  const serializer = this.subject();
  const questionResult = QuestionResult.create({
    resourceId: 'resource-id',
    timeSpent: 10000,
    reaction: 2,
    answer: 'answer'
  });
  const response = serializer.serializeResourceResult(questionResult);
  const expected = {
    resourceId: 'resource-id',
    timeSpent: 10000,
    reaction: 2,
    answer: 'answer'
  };
  assert.deepEqual(expected, response, 'Wrong response');
});

test('normalizeAssessmentResult', function(assert) {
  const serializer = this.subject();
  const payload = {
    contextId: 'context-id',
    currentResourceId: 'resource-id-2',
    collectionStatus: [{
      resourceId: 'resource-id-1',
      timeSpent: 10000,
      reaction: 1,
      answer: 'answer-1'
    },{
      resourceId: 'resource-id-2',
      timeSpent: 20000,
      reaction: 3,
      answer: 'answer-2'
    }]
  };
  const response = serializer.normalizeAssessmentResult(payload);
  assert.equal(response.get('contextId'), 'context-id', 'Wrong context id value');
  assert.equal(response.get('currentResourceId'), 'resource-id-2', 'Wrong current resource id value');
  assert.equal(response.get('resourceResults').length, 2, 'Wrong resource results length');
  assert.equal(response.get('resourceResults')[0].get('answer'), 'answer-1', 'Wrong first answer');
  assert.equal(response.get('resourceResults')[0].get('reaction'), 1, 'Wrong first reaction');
  assert.equal(response.get('resourceResults')[0].get('resourceId'), 'resource-id-1', 'Wrong first resource id');
  assert.equal(response.get('resourceResults')[0].get('timeSpent'), 10000, 'Wrong first time spent');
  assert.equal(response.get('resourceResults')[1].get('answer'), 'answer-2', 'Wrong second answer');
  assert.equal(response.get('resourceResults')[1].get('reaction'), 3, 'Wrong second reaction');
  assert.equal(response.get('resourceResults')[1].get('resourceId'), 'resource-id-2', 'Wrong second resource id');
  assert.equal(response.get('resourceResults')[1].get('timeSpent'), 20000, 'Wrong second time spent');
});

test('normalizeResourceResults', function(assert) {
  const serializer = this.subject();
  const payload = [{
    resourceId: 'resource-id-1',
    timeSpent: 10000,
    reaction: 1,
    answer: 'answer-1'
  },{
    resourceId: 'resource-id-2',
    timeSpent: 20000,
    reaction: 3,
    answer: 'answer-2'
  }];
  const response = serializer.normalizeResourceResults(payload);
  assert.equal(response.length, 2, 'Wrong resource results length');
  assert.equal(response[0].get('answer'), 'answer-1', 'Wrong first answer');
  assert.equal(response[0].get('reaction'), 1, 'Wrong first reaction');
  assert.equal(response[0].get('resourceId'), 'resource-id-1', 'Wrong first resource id');
  assert.equal(response[0].get('timeSpent'), 10000, 'Wrong first time spent');
  assert.equal(response[1].get('answer'), 'answer-2', 'Wrong second answer');
  assert.equal(response[1].get('reaction'), 3, 'Wrong second reaction');
  assert.equal(response[1].get('resourceId'), 'resource-id-2', 'Wrong second resource id');
  assert.equal(response[1].get('timeSpent'), 20000, 'Wrong second time spent');
});
