import Ember from 'ember';
import AssessmentResult from 'quizzes/models/result/assessment';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';
import { module, test } from 'qunit';

module('Unit | Model | result/assessment');


test('questionResults', function(assert) {
  let assessmentResult = AssessmentResult.create({
    'resourceResults': Ember.A([
      ResourceResult.create(),
      ResourceResult.create(),
      QuestionResult.create()
    ])
  });

  assert.equal(assessmentResult.get('questionResults').get('length'), 1, 'Wrong question results');
});

test('totalResources', function(assert) {
  let assessmentResult = AssessmentResult.create({
    'resourceResults': Ember.A([1,2])
  });

  assert.equal(assessmentResult.get('totalResources'), 2, 'Wrong total resources');
});

test('currentResult', function(assert) {
  let assessmentResult = AssessmentResult.create({
    'currentResourceId': 2,
    'resourceResults': Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(assessmentResult.get('currentResult').get('resourceId'), 2, 'Wrong result');
});

test('getResultByResourceId', function(assert) {
  let assessmentResult = AssessmentResult.create({
    'resourceResults': Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(assessmentResult.getResultByResourceId(1).get('resourceId'), 1, 'Wrong result');
});
