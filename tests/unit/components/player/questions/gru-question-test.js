import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes/models/content/question';

moduleForComponent('player/questions/gru-question', 'Unit | Component | player/questions/gru question', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('hasUserAnswer', function(assert) {
  let component = this.subject();
  assert.notOk(component.get('hasUserAnswer'), 'Has user answer should be false');
  component.set('userAnswer', 'answer');
  assert.ok(component.get('hasUserAnswer'), 'Has user answer should be true');
});

test('notifyAnswerChanged', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.set('sendAction', function(actionName, q, answer) {
    assert.equal(actionName, 'onAnswerChanged', 'Action sent should match');
    assert.equal(q, question, 'Question object should match');
    assert.equal(answer, 'answer', 'Answer should match');
  });
  component.notifyAnswerChanged('answer');
});

test('notifyAnswerCleared', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.set('sendAction', function(actionName, q, answer) {
    assert.equal(actionName, 'onAnswerCleared', 'Action sent should match');
    assert.equal(q, question, 'Question object should match');
    assert.equal(answer, 'answer', 'Answer should match');
  });
  component.notifyAnswerCleared('answer');
});

test('notifyAnswerCompleted', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.set('sendAction', function(actionName, q, answer) {
    assert.equal(actionName, 'onAnswerCompleted', 'Action sent should match');
    assert.equal(q, question, 'Question object should match');
    assert.equal(answer, 'answer', 'Answer should match');
  });
  component.notifyAnswerCompleted('answer');
});

test('notifyAnswerLoaded', function(assert) {
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.set('sendAction', function(actionName, q, answer) {
    assert.equal(actionName, 'onAnswerLoaded', 'Action sent should match');
    assert.equal(q, question, 'Question object should match');
    assert.equal(answer, 'answer', 'Answer should match');
  });
  component.notifyAnswerLoaded('answer');
});
