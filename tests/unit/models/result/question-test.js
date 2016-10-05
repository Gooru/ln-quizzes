import QuestionResult from 'quizzes/models/result/question';
import { module, test } from 'qunit';

module('Unit | Model | result/question');

test('questionId', function(assert) {
  let questionResult = QuestionResult.create({
    'resourceId': 'fakeResultId'
  });

  assert.equal(questionResult.get('questionId'), 'fakeResultId', 'Wrong question id');
});

test('correct', function(assert) {
  let questionResult = QuestionResult.create({
    'score': 0
  });

  assert.equal(questionResult.get('correct'), false, 'It should not be correct');

  questionResult.set('score', 50);
  assert.equal(questionResult.get('correct'), false, 'It should not be correct');

  questionResult.set('score', 100);
  assert.equal(questionResult.get('correct'), true, 'It should be correct');
});
