import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { GRADING_SCALE } from 'quizzes/config/config';
import Collection from 'quizzes/models/collection/collection';
import Resource from 'quizzes/models/resource/resource';
import QuestionResult from 'quizzes/models/result/question';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';

moduleForComponent('reports/class-assessment/gru-summary', 'Integration | Component | reports/class assessment/gru summary', {
  integration: true,
  beforeEach: function () {
    this.inject.service('i18n');
  }
});

test('it renders', function (assert) {
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
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 1,
            savedTime: 1216,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 2,
            savedTime: 2458,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            reaction: 3,
            savedTime: 1433,
            answer: [{ value: 1 }]
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 5,
            savedTime: 1216,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            reaction: 3,
            savedTime: 1433,
            answer: [{ value: 1 }]
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 1,
            savedTime: 1216,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 5,
            savedTime: 2458,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            reaction: 5,
            savedTime: 1433,
            answer: [{ value: 1 }]
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a9082f705e65f2fe607',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            reaction: 4,
            savedTime: 1216,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 4,
            savedTime: 2458,
            answer: [{ value: 1 }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            reaction: 3,
            savedTime: 1433,
            answer: [{ value: 1 }]
          })
        ])
      })
    ]
  });

  this.setProperties({
    reportData: reportData,
    showAllQuestions: true
  });

  this.render(hbs`{{ reports/class-assessment/gru-summary
    reportData=reportData
    isQuestionView=showAllQuestions }}`);

  const $component = this.$('.reports.class-assessment.gru-summary');
  assert.ok($component.length, 'Component has component classes');

  // Overview -Circular charts
  let $overview = $component.find('.overview');

  assert.equal($overview.length, 2,
    'The charts are rendered in 2 containers -one is for the collapsed view of the questions; the other one is for the expanded view');

  $overview = $component.find('.overview:first');

  assert.ok($overview.find('.scores .gru-pie-chart').length, 'Overview section has a pie chart with the class scores');
  assert.equal($overview.find('.scores > span').text(), this.get('i18n').t('common.classScores').string,
    'The class scores pie chart has the correct caption');

  assert.ok($overview.find('.average-score .gru-bubble-chart').length, 'Overview section has a colored circle with the average class score');
  assert.equal($overview.find('.average-score .gru-bubble-chart').text().trim(), '71%', 'Average class score is computed correctly');
  assert.equal($overview.find('.average-score > span').text(), this.get('i18n').t('common.averageScore').string,
    'The circle with the average class score has the correct caption');

  assert.ok($overview.find('.completion .gru-radial-chart').length, 'Overview section has a radial chart with the proportion of students that have completed the assessment');
  assert.ok($overview.find('.completion .gru-radial-chart').text().trim(), '3/4', 'Radial chart label shows the correct proportion of students that have completed the assessment');
  assert.equal($overview.find('.completion > span').text(), this.get('i18n').t('common.completed').string,
    'The radial chart has the correct caption');

  $overview = $component.find('.overview:last');

  assert.ok($overview.hasClass('small'), 'The chart container for the expanded view of the questions can be identified by a class');
  assert.ok($overview.find('.scores .gru-pie-chart').length, 'Overview section has a pie chart with the class scores');

  assert.ok($overview.find('.average-score .gru-bubble-chart').length, 'Overview section has a colored circle with the average class score');
  assert.equal($overview.find('.average-score .gru-bubble-chart').text().trim(), '71%', 'Average class score is computed correctly');

  assert.ok($overview.find('.completion .gru-radial-chart').length, 'Overview section has a radial chart with the proportion of students that have completed the assessment');
  assert.ok($overview.find('.completion .gru-radial-chart').text().trim(), '3/4', 'Radial chart label shows the correct proportion of students that have completed the assessment');

  // Question summary
  const $questions = $component.find('.gru-questions-summary ol li');
  assert.equal($questions.length, 3, 'The question summary shows the information for all the questions');

  // Layout of the first question
  const $firstQuestion = $questions.first();

  let $incorrectBar = $firstQuestion.find('.gru-x-bar-chart .segment:first');
  assert.ok($incorrectBar.attr('style').split(';')[0].indexOf(GRADING_SCALE[0].COLOR) > 0, 'First question -first segment, correct color');
  assert.ok($incorrectBar.attr('style').split(';')[1].indexOf('75%') > 0, 'First question -first segment, correct percentage');

  let $correctBar = $firstQuestion.find('.gru-x-bar-chart .segment:last');
  assert.ok($correctBar.attr('style').split(';')[0].indexOf(GRADING_SCALE[GRADING_SCALE.length - 1].COLOR) > 0, 'First question -second segment, correct color');
  assert.ok($correctBar.attr('style').split(';')[1].indexOf('25%') > 0, 'First question -second segment, correct percentage');

  let $ratio = $firstQuestion.find('.ratio');
  assert.equal($ratio.find('span:first').text(), '4', 'First question -correct number of students that have completed');
  assert.equal($ratio.find('span:last').text(), '4', 'First question -correct number of total students');

  // Layout of the last question
  const $lastQuestion = $questions.last();

  $incorrectBar = $lastQuestion.find('.gru-x-bar-chart .segment:first');
  assert.ok($incorrectBar.attr('style').split(';')[1].indexOf('0%') > 0, 'Second question -first segment, correct percentage');

  $correctBar = $lastQuestion.find('.gru-x-bar-chart .segment:last');
  assert.ok($correctBar.attr('style').split(';')[1].indexOf('75%') > 0, 'Second question -second segment, correct percentage');

  $ratio = $lastQuestion.find('.ratio');
  assert.equal($ratio.find('span:first').text(), '3', 'Second question -correct number of students that have completed');
  assert.equal($ratio.find('span:last').text(), '4', 'Second question -correct number of total students');

  assert.ok($component.find('.grading-scale-legend').length, 'Component has a grading scale legend');
});
