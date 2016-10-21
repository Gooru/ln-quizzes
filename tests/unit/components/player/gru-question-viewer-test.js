import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes/models/content/question';
import QuestionResult from 'quizzes/models/result/question';

moduleForComponent('player/gru-question-viewer', 'Unit | Component | player/gru question viewer', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('changeAnswer', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  component.send('changeAnswer', question);
  assert.deepEqual(component.question, question, 'Question object should match');
});

test('clearAnswer', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  component.send('clearAnswer', question);
  assert.deepEqual(component.question, question, 'Question object should match');
  assert.notOk(component.answerCompleted, 'answerCompleted should be updated');
});

test('completeAnswer', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let answer = 'answer';
  component.set('questionResult', questionResult);
  component.send('completeAnswer', question, answer);
  assert.deepEqual(component.question, question, 'Question object should match');
  assert.equal(questionResult.answer, answer, 'Question result answer should be updated');
  assert.ok(component.answerCompleted, 'answerCompleted should be updated');
});

test('loadedAnswer', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let answer = 'answer';
  component.set('questionResult', questionResult);
  component.send('loadedAnswer', question, answer);
  assert.deepEqual(component.question, question, 'Question object should match');
  assert.equal(questionResult.answer, answer, 'Question result answer should be updated');
  assert.notOk(component.answerCompleted, 'answerCompleted should be updated');
});

test('showExplanation', function(assert) {
  let component = this.subject();
  component.send('showExplanation');
  assert.ok(component.isExplanationShown, 'isExplanationShown should be updated');
});

test('showHint', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    hints: ['hint0', 'hint1']
  });
  component.set('question', question);
  component.set('actualHint', 1);
  component.send('showHint');
  assert.equal(component.get('actualHint'), 2, 'actualHint should be updated');
  assert.ok(component.get('hintsToDisplay').indexOf('hint1') > -1, 'Hint should be added to display');
});

test('submitQuestion', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.set('questionResult', questionResult);
  component.set('sendAction', function(actionName, q, result){
    assert.equal(actionName, 'onSubmitQuestion', 'Action sent should match');
    assert.deepEqual(q, question, 'Question should match');
    assert.deepEqual(result, questionResult, 'QuestionResult should match');
  });
  component.send('submitQuestion');
});

test('reloadQuestion', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let question2 = Question.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.setProperties({
    actualHint: 5,
    answerCompleted: true,
    hintsToDisplay: '',
    isExplanationShown: true
  });
  component.set('question', question2);
  assert.equal(component.get('actualHint'), 0, 'Actual hint should be updated.');
  assert.equal(component.get('answerCompleted'), false, 'Answer completed hint should be updated.');
  assert.ok(component.get('hintsToDisplay').length === 0, 'Hints to display should be updated.');
  assert.equal(component.get('isExplanationShown'), false, 'Is explanation shown should be updated.');
});
