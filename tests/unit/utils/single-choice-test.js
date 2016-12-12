import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import AnswerObject from 'quizzes/utils/question/answer-object';
import SingleChoiceUtil from 'quizzes/utils/question/single-choice';
import { module, test } from 'qunit';

module('Unit | Utility | single choice');

// --------------- Single Choice tests
test('Single Choice - getCorrectAnswer empty array', function (assert) {
  let question = Ember.Object.create({answers: Ember.A([])});
  let questionUtil = SingleChoiceUtil.create({question: question});
  assert.ok(!questionUtil.getCorrectAnswer(), 'Correct answer should not be found');
});

test('Single Choice - getCorrectAnswer no correct answer provided', function (assert) {
  let answers = Ember.A([
    Ember.Object.create({id: 1, isCorrect: false})
  ]);

  let question = Ember.Object.create({answers: answers});
  let questionUtil = SingleChoiceUtil.create({question: question});
  assert.ok(!questionUtil.getCorrectAnswer(), 'Correct answer should not be found');
});

test('Single Choice - getCorrectAnswer when correct answer is provided', function (assert) {
  let answers = Ember.A([
    Ember.Object.create({id: 1, isCorrect: false}),
    Ember.Object.create({id: 2, isCorrect: true})
  ]);

  let question = Ember.Object.create({answers: answers});
  let questionUtil = SingleChoiceUtil.create({question: question});
  assert.equal(questionUtil.getCorrectAnswer(), 2, 'Incorrect answer id');
});

test('Single Choice - isCorrect', function (assert) {
  let answers = Ember.A([
    Ember.Object.create({id: 1, isCorrect: false}),
    Ember.Object.create({id: 2, isCorrect: true})
  ]);

  let question = Ember.Object.create({answers: answers});
  let questionUtil = SingleChoiceUtil.create({question: question});

  assert.ok(!questionUtil.isCorrect(1), 'Option one is not correct');
  assert.ok(questionUtil.isCorrect(2), 'Option two should be correct');
});

test('Single Choice - distribution', function (assert) {
  let questionUtil = SingleChoiceUtil.create({question: null});

  let distribution = questionUtil.distribution([
    QuestionResult.create({
      answer: 1
    }),
    QuestionResult.create({
      answer: 1
    }),
    QuestionResult.create({
      answer: 2
    }),
    QuestionResult.create({
      answer: 3
    }),
    QuestionResult.create({
      answer: 4
    }),
    QuestionResult.create({
      answer: 3
    }),
    QuestionResult.create({
      answer: 2
    }),
    QuestionResult.create({
      answer: 3
    })
  ]);

  let answers = distribution.map(item => item.get('answer')).toArray();
  let counts = distribution.map(item => item.get('count')).toArray();

  assert.deepEqual(answers, [1, 2, 3, 4], 'Wrong answers');
  assert.deepEqual(counts, [2, 2, 3, 1], 'Wrong counts');
});

test('Single Choice - answerKey', function (assert) {
  let questionUtil = SingleChoiceUtil.create({question: null});

  let key = questionUtil.answerKey(1);
  assert.equal(key, 1, 'Wrong key');
});

test('Single Choice - sameAnswer', function (assert) {
  let questionUtil = SingleChoiceUtil.create({question: null});
  assert.ok(questionUtil.sameAnswer(1, 1), 'Answer should be the same');
  assert.ok(!questionUtil.sameAnswer(1, 2), 'Answer should not be the same');
});

test('Single Choice - toAnswerObjects', function (assert) {
  let answers = Ember.A([
    Ember.Object.create({id: 1, isCorrect: false, text: 'Option A'}),
    Ember.Object.create({id: 2, isCorrect: true, text: 'Option B'})
  ]);

  let question = Ember.Object.create({answers: answers});
  let questionUtil = SingleChoiceUtil.create({question: question});

  let answerObjects = questionUtil.toAnswerObjects(2);
  assert.equal(answerObjects.length, 1, 'Only 1 answer object should be found');

  let answerObject = answerObjects.get('firstObject');
  assert.equal(answerObject.get('answerId'), 2, 'Wrong answerId');
  assert.equal(answerObject.get('skip'), false, 'Wrong skipped');
  assert.equal(answerObject.get('order'), 1, 'Wrong order');
  assert.equal(answerObject.get('text'), 'Option B', 'Wrong status');
});

test('Single Choice - toUserAnswer', function (assert) {
  let answers = Ember.A([
    Ember.Object.create({id: 1, isCorrect: false, text: 'Option A'}),
    Ember.Object.create({id: 2, isCorrect: true, text: 'Option B'})
  ]);

  let question = Ember.Object.create({answers: answers});
  let questionUtil = SingleChoiceUtil.create({question: question});

  let answerObject = AnswerObject.create({ answerId: 1 });
  let userAnswer = questionUtil.toUserAnswer(Ember.A([answerObject]));
  assert.equal(userAnswer, 1, 'Wrong userAnswer');
});
