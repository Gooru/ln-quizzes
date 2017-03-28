import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Collection from 'quizzes-addon/models/collection/collection';
import ContextResult from 'quizzes-addon/models/result/context';
import QuestionResult from 'quizzes-addon/models/result/question';
import ResourceResult from 'quizzes-addon/models/result/resource';
import Resource from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent('reports/qz-assessment-report', 'Integration | Component | reports/qz assessment report', {
  integration: true
});

test('Layout when answer results are shown', function (assert) {

  let resourceResults = [
    QuestionResult.create({
      resource: Resource.create({
        id: 'question-1',
        sequence: 1,
        body: 'Question 1',
        isResource: false
      })
    })
  ];

  this.set('contextResult', ContextResult.create({
    totalAttempts: 0,
    resourceResults
  }));

  this.render(hbs`
  {{reports/qz-assessment-report
    contextResult=contextResult
  }}`);

  const $component = this.$('.reports.qz-assessment-report');
  assert.ok($component.length, 'Component');
  assert.ok($component.find('> .qz-summary').length, 'Top Summary');
  assert.equal($component.find('> .qz-questions').length, 1, 'Questions Summary');
  assert.notOk($component.find('> .qz-resources').length, 'Resources Summary -hidden');
});

test('Layout when answer results are not shown', function (assert) {

  let resourceResults = [
    QuestionResult.create({
      resource: Resource.create({
        id: 'question-1',
        sequence: 1,
        body: 'Question 1',
        isResource: false
      })
    })
  ];

  this.set('contextResult', ContextResult.create({
    totalAttempts: 0,
    resourceResults
  }));

  this.render(hbs`
  {{reports/qz-assessment-report
    areAnswersHidden=true
    contextResult=contextResult
  }}`);

  const $component = this.$('.reports.qz-assessment-report');
  assert.ok($component.length, 'Component');
  assert.ok($component.find('> .qz-summary').length, 'Top Summary');
  assert.ok($component.find('> .hidden-report').length, 'Top Summary');
  assert.notOk($component.find('> .qz-questions').length, 'Questions Summary -hidden');
  assert.notOk($component.find('> .qz-resources').length, 'Resources Summary -hidden');
});

test('Layout with open ended and resources', function (assert) {

  let resourceResults = [
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
  ];

  this.set('contextResult', ContextResult.create({
    totalAttempts: 0,
    resourceResults
  }));

  this.render(hbs`
  {{reports/qz-assessment-report
    contextResult=contextResult
  }}`);

  const $component = this.$('.reports.qz-assessment-report');
  assert.ok($component.length, 'Component');
  assert.ok($component.find('> .qz-summary').length, 'Top Summary');
  assert.equal($component.find('> .qz-questions').length, 2, 'Questions Summary');
  assert.ok($component.find('> .qz-resources').length, 'Resources Summary');
});
