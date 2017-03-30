import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import ContextResult from 'quizzes-addon/models/result/context';
import QuestionResult from 'quizzes-addon/models/result/question';
import ResourceResult from 'quizzes-addon/models/result/resource';
import Resource from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent('reports/qz-assessment-report', 'Unit | Component | reports/qz assessment report', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('isRealTime', function(assert) {
  let contextResult = ContextResult.create({
    isRealTime: true
  });
  const model = { contextResult };
  let component = this.subject({ model });
  assert.ok(component.get('isRealTime'), 'Should be true');
  contextResult.set('isRealTime', false);
  assert.notOk(component.get('isRealTime'), 'Should be false');
});

test('showAttempts', function(assert) {
  let contextResult = ContextResult.create({
    showAttempts: true
  });
  const model = { contextResult };
  let component = this.subject({ model });
  assert.ok(component.get('showAttempts'), 'Should be true');
  contextResult.set('showAttempts', false);
  assert.notOk(component.get('showAttempts'), 'Should be false');
});

test('orderedQuestions', function(assert) {
  let contextResult = ContextResult.create({
    sortedResourceResults: 'resourse-results'
  });
  const model = { contextResult };
  let component = this.subject({ model });
  assert.equal(component.get('orderedQuestions'), 'resourse-results', 'Ordered questions should match');
});

test('resultsQuestions, resultsOpenEnded and resultsResources', function(assert) {
  let contextResult = ContextResult.create({
    sortedResourceResults: Ember.A([
      QuestionResult.create({
        resource: Resource.create({
          id: 'question-1',
          sequence: 1,
          body: 'Question 1',
          type: QUESTION_TYPES.singleChoice,
          isResource: false
        })
      }),
      ResourceResult.create({
        resource: Resource.create({
          id: 'resource-1',
          sequence: 2,
          body: 'Resource 1',
          isResource: true
        })
      }),
      QuestionResult.create({
        resource: Resource.create({
          id: 'open-ended-1',
          sequence: 3,
          body: 'Open Ended 1',
          type: QUESTION_TYPES.openEnded,
          isResource: false
        })
      })
    ])
  });
  const model = { contextResult };
  let component = this.subject({ model });
  assert.equal(component.get('resultsQuestions').length, 1, 'Lenght of resultsQuestions should be 1');
  assert.equal(component.get('resultsQuestions')[0].get('resource.id'), 'question-1', 'Question id should match');
  assert.equal(component.get('resultsOpenEnded').length, 1, 'Lenght of resultsOpenEnded should be 1');
  assert.equal(component.get('resultsOpenEnded')[0].get('resource.id'), 'open-ended-1', 'Open Ended question id should match');
  assert.equal(component.get('resultsResources').length, 1, 'Lenght of resultsResources should be 1');
  assert.equal(component.get('resultsResources')[0].get('resource.id'), 'resource-1', 'Resource id should match');
});
