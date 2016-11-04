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
