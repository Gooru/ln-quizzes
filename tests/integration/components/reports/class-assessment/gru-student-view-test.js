import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes/models/collection/collection';
import Resource from 'quizzes/models/resource/resource';
import QuestionResult from 'quizzes/models/result/question';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';
import T from 'quizzes/tests/helpers/assert';

moduleForComponent('reports/class-assessment/gru-student-view', 'Integration | Component | reports/class assessment/gru student view', {
  integration: true
});

test('Layout', function (assert) {
  let collection = Collection.create({
    resources: [
      Resource.create({
        id: '56a120483b6e7b090501d3e7',
        sequence: 1
      }),
      Resource.create({
        id: '56a1204886b2e565e1b2c230',
        sequence: 3
      }),
      Resource.create({
        id: '56a12048ddee2022a741356a',
        sequence: 2
      })
    ]
  });

  let reportData = ReportData.create({
    collection,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        profileName: 'Lorena Prendas Chavarria',
        profileCode: 'student-code-1',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            answer: true
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            answer: true
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            answer: true
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        profileName: 'Andres Charpentier Zuñiga',
        profileCode: 'student-code-2',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            answer: true
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            answer: true
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 0,
            answer: true
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        profileName: 'David Zumbado Alfaro',
        profileCode: 'student-code-3',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            answer: true
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 0,
            answer: true
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 0,
            answer: true
          })
        ])
      })
    ]
  });

  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-student-view reportData=reportData}}`);

  const $component = this.$();
  T.exists(assert, $component.find('.sort-section'), 'Sort section missing');
  const $avrgSortBtn =$component.find('.sort-section button.sort-average');
  const $alphabeticalSortBtn =$component.find('.sort-section button.sort-alphabetical');
  T.exists(assert, $avrgSortBtn, 'Missing sort by average');
  T.exists(assert, $alphabeticalSortBtn, 'Missing sort alphabetically');
  assert.equal($component.find('.gru-student-performance-box').length, 3, 'It should displayed 3 boxes');

  $firstStudentPerformanceBox = $component.find('.gru-student-performance-box:first-child');
  assert.equal(T.text($firstStudentPerformanceBox.find('.panel-heading')), 'Lorena Prendas Chavarria (100%)', 'It should say Lorena Prendas Chavarria (100%)');

  $lastStudentPerformanceBox = $component.find('.gru-student-performance-box:last-child');
  assert.equal(T.text($lastStudentPerformanceBox.find('.panel-heading')), 'David Zumbado Alfaro (33%)', 'It should say David Zumbado Alfaro (33%)');

  $alphabeticalSortBtn.click();

  let $firstStudentPerformanceBox = $component.find('.gru-student-performance-box:first-child');
  assert.equal(T.text($firstStudentPerformanceBox.find('.panel-heading')), 'Andres Charpentier Zuñiga (67%)', 'It should say Andres Charpentier Zuñiga');

  let $lastStudentPerformanceBox = $component.find('.gru-student-performance-box:last-child');
  assert.equal(T.text($lastStudentPerformanceBox.find('.panel-heading')), 'Lorena Prendas Chavarria (100%)', 'It should say Lorena Prendas Chavarria');
});
