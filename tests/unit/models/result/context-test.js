import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/context', 'Unit | Model | result/context');

test('questionResults', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create(),
      ResourceResult.create(),
      QuestionResult.create()
    ])
  });

  assert.equal(contextResult.get('questionResults').get('length'), 1, 'Wrong question results');
});

test('totalResources', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([1,2])
  });

  assert.equal(contextResult.get('totalResources'), 2, 'Wrong total resources');
});

test('currentResult', function(assert) {
  let contextResult = this.subject({
    currentResourceId: 2,
    resourceResults: Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(contextResult.get('currentResult').get('resourceId'), 2, 'Wrong result');
});

test('getResultByResourceId', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(contextResult.getResultByResourceId(1).get('resourceId'), 1, 'Wrong result');
});
