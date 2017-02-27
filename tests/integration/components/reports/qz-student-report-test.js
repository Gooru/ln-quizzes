import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes/models/collection/collection';
import Resource from 'quizzes/models/resource/resource';
import QuestionResult from 'quizzes/models/result/question';
import ReportDataEvent from 'quizzes/models/result/report-data-event';

moduleForComponent('reports/qz-student-report', 'Integration | Component | reports/qz student report', {
  integration: true
});

test('Layout', function(assert) {

  const collection = Collection.create({
    id: 'collection-id',
    isCollection: false,
    title: 'Sample Assessment Name',
    resources: [
      Resource.create({
        id: 'resource-1-id',
        sequence: 1,
        title: 'Resource 1'
      }),
      Resource.create({
        id: 'resource-2-id',
        sequence: 2,
        title: 'Resource 2'
      })
    ]
  });

  this.set('attemptData', ReportDataEvent.create({
    attemptId: 'attempt-id',
    collection,
    collectionId: collection.id,
    contextId: 'context-id',
    currentResourceId: 'resource-1-id',
    profileId: 'user-2-id',
    resourceResults: Ember.A([
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-1-id',
        reaction: 2,
        savedTime: 701
      }),
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-2-id',
        reaction: 4,
        savedTime: 1333
      })
    ])
  }));
  this.render(hbs`{{reports/qz-student-report attemptData=attemptData}}`);

  const $component = this.$('.reports.qz-student-report');
  assert.ok($component.length, 'Component');
  assert.ok($component.find('.reports.gru-assessment-report').length, 'Assessment report');
});

test('Layout when show key setting', function (assert) {
  const collection = Collection.create({
    id: 'collection-id',
    isCollection: false,
    title: 'Sample Assessment Name',
    resources: [
      Resource.create({
        id: 'resource-1-id',
        sequence: 1,
        title: 'Resource 1'
      }),
      Resource.create({
        id: 'resource-2-id',
        sequence: 2,
        title: 'Resource 2'
      })
    ],
    settings:{
      showKey:false
    }
  });

  this.set('attemptData', ReportDataEvent.create({
    attemptId: 'attempt-id',
    collection,
    collectionId: collection.id,
    contextId: 'context-id',
    currentResourceId: 'resource-1-id',
    profileId: 'user-2-id',
    resourceResults: Ember.A([
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-1-id',
        reaction: 2,
        savedTime: 701
      }),
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-2-id',
        reaction: 4,
        savedTime: 1333
      })
    ])
  }));

  this.render(hbs`{{reports/qz-student-report attemptData=attemptData}}`);

  const $component = this.$('.reports.gru-assessment-report');
  assert.ok($component.length, 'Component');
  assert.notOk($component.find('.gru-questions .questions-header .performance').length, 'Performance button should not appear');
  assert.notOk($component.find('.gru-questions .questions-header .correct-answer').length, 'Correct answer button should not appear');

  const collection2 = Collection.create({
    id: 'collection-id',
    isCollection: false,
    title: 'Sample Assessment Name',
    resources: [
      Resource.create({
        id: 'resource-1-id',
        sequence: 1,
        title: 'Resource 1'
      }),
      Resource.create({
        id: 'resource-2-id',
        sequence: 2,
        title: 'Resource 2'
      })
    ],
    settings:{
      showKey:true
    }
  });

  this.set('attemptData', ReportDataEvent.create({
    attemptId: 'attempt-id',
    collection:collection2,
    collectionId: collection2.id,
    contextId: 'context-id',
    currentResourceId: 'resource-1-id',
    profileId: 'user-2-id',
    resourceResults: Ember.A([
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-1-id',
        reaction: 2,
        savedTime: 701
      }),
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-2-id',
        reaction: 4,
        savedTime: 1333
      })
    ])
  }));

  assert.ok($component.find('.gru-questions .questions-header .performance').length, 'Performance button should appear');
  assert.ok($component.find('.gru-questions .questions-header .correct-answer').length, 'Correct answer button should appear');
});
