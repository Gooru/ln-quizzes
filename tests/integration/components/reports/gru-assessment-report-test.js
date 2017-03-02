import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Collection from 'quizzes-addon/models/collection/collection';
import ContextResult from 'quizzes-addon/models/result/context';
import QuestionResult from 'quizzes-addon/models/result/question';

moduleForComponent('reports/gru-assessment-report', 'Integration | Component | reports/gru assessment report', {
  integration: true
});

test('Layout when answer results are shown', function (assert) {

  let resourceResults = [
    QuestionResult.create({
      id: 'question-1',
      sequence: 1,
      text: 'Question 1'
    })
  ];

  this.set('contextResult', ContextResult.create({
    sortedResourceResults: Ember.A(),
    totalAttempts: 0,
    collection: Collection.create({
      isCollection: false,
      title: 'Sample Assessment Name',
      resources: resourceResults
    }),
    resourceResults
  }));

  this.render(hbs`
  {{reports/gru-assessment-report
    contextResult=contextResult
  }}`);

  const $component = this.$('.reports.gru-assessment-report');
  assert.ok($component.length, 'Component');
  assert.ok($component.find('> .gru-summary').length, 'Top Summary');
  assert.ok($component.find('> .gru-questions').length, 'Questions Summary');
});

test('Layout when answer results are not shown', function (assert) {

  let resourceResults = [
    QuestionResult.create({
      id: 'question-1',
      sequence: 1,
      text: 'Question 1'
    })
  ];

  this.set('contextResult', ContextResult.create({
    sortedResourceResults: Ember.A(),
    totalAttempts: 0,
    collection: Collection.create({
      isCollection: false,
      title: 'Sample Assessment Name',
      resources: resourceResults
    }),
    resourceResults
  }));

  this.render(hbs`
  {{reports/gru-assessment-report
    areAnswersHidden=true
    contextResult=contextResult
  }}`);

  const $component = this.$('.reports.gru-assessment-report');
  assert.ok($component.length, 'Component');
  assert.ok($component.find('> .gru-summary').length, 'Top Summary');
  assert.ok($component.find('> .hidden-report').length, 'Top Summary');
  assert.notOk($component.find('> .gru-questions').length, 'Questions Summary -hidden');
});
