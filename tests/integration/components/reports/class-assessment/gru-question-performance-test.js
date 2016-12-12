import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Collection from 'quizzes/models/collection/collection';
import Answer from 'quizzes/models/resource/answer';
import Resource from 'quizzes/models/resource/resource';
import QuestionResult from 'quizzes/models/result/question';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';

moduleForComponent('reports/class-assessment/gru-question-performance', 'Integration | Component | reports/class assessment/gru question performance', {
  integration: true
});

test('When students have no answers yet', function (assert) {
  const selectedQuestion = Resource.create({ //Single Choice
    id: '56b120483b6e7b090501d3e7',
    isResource: false,
    questionType: 'single_choice',
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({value: 1, text: 'Answer 1'}),
      Answer.create({value: 2, text: 'Answer 2'}),
      Answer.create({value: 3, text: 'Answer 3'})
    ]),
    sequence: 1
  });

  let assessment = Collection.create({
    resources: [selectedQuestion]
  });

  let reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          })
        ])
      })
    ]
  });

  this.set('selectedQuestion', selectedQuestion);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-question-performance
          reportData=reportData
          question=selectedQuestion }}`);

  const $component = this.$();
  const $chart = $component.find('.chart');
  T.exists(assert, $chart, 'Missing chart');
  T.exists(assert, $chart.find('.gru-x-bar-chart'), 'Missing gru-x-bar-chart');

  T.exists(assert, $component.find('.overall-completion'), 'Missing overal-performance');
  assert.equal(T.text($component.find('.overall-completion')), '0/0', 'Wrong completion text');

  T.notExists(assert, $component.find('.panel'), 'No panel should be found');
});

test('Non anonymous, layout', function (assert) {
  const selectedQuestion = Resource.create({ //Single Choice
    id: '56a120483b6e7b090501d3e7',
    isResource: false,
    questionType: 'single_choice',
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({value: 1, text: 'Answer 1'}),
      Answer.create({value: 2, text: 'Answer 2'}),
      Answer.create({value: 3, text: 'Answer 3'})
    ]),
    sequence: 1
  });

  let assessment = Ember.Object.create({
    resources: [ selectedQuestion ]
  });

  let reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 1,
            score: 0,
            reaction: 1,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 2,
            score: 0,
            reaction: 5,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 3,
            score: 100,
            reaction: 1,
            savedTime: 1216
          })
        ])
      })
    ]
  });

  this.set('selectedQuestion', selectedQuestion);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-question-performance
          reportData=reportData
          question=selectedQuestion }}`);

  const $component = this.$();
  const $chart = $component.find('.chart');
  T.exists(assert, $chart, 'Missing chart');
  T.exists(assert, $chart.find('.gru-x-bar-chart'), 'Missing gru-x-bar-chart');

  T.exists(assert, $component.find('.overall-completion'), 'Missing overal-performance');
  assert.equal(T.text($component.find('.overall-completion')), '3/3', 'Wrong completion text');

  T.exists(assert, $component.find('.panel'), 'Missing panels, answers were given');
  T.exists(assert, $component.find('.panel .panel-heading'), 'Missing panel headers, answers were given');
  T.exists(assert, $component.find('.panel .panel-heading .percentage'), 'Missing percentage');

  T.exists(assert, $component.find('.panel .answers-wrapper .answer'), 'Missing answers, answers were given');
  T.exists(assert, $component.find('.panel .answers-wrapper .students'), 'Missing students, answers were given');
  T.exists(assert, $component.find('.panel .answers-wrapper .students .label'), 'Missing students names');
});

test('Anonymous, layout', function (assert) {
  const selectedQuestion = Resource.create({ //Single Choice
    id: '56a120483b6e7b090501d3e7',
    isResource: false,
    questionType: 'single_choice',
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({value: 1, text: 'Answer 1'}),
      Answer.create({value: 2, text: 'Answer 2'}),
      Answer.create({value: 3, text: 'Answer 3'})
    ]),
    sequence: 1
  });

  let assessment = Ember.Object.create({
    resources: [ selectedQuestion ]
  });

  let reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 1,
            score: 0,
            reaction: 1,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 2,
            score: 0,
            reaction: 5,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 3,
            score: 100,
            reaction: 1,
            savedTime: 1216
          })
        ])
      })
    ]
  });

  this.set('selectedQuestion', selectedQuestion);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-question-performance
          reportData=reportData
          anonymous=true
          showResult=false
          question=selectedQuestion }}`);

  const $component = this.$();
  const $chart = $component.find('.chart');
  T.exists(assert, $chart, 'Chart information should visible on anonymous but blue');

  T.exists(assert, $component.find('.panel'), 'Missing panels, answers were given');
  T.exists(assert, $component.find('.panel .panel-heading-anonymous'), 'Missing anonymous panel headers, answers were given');
  T.notExists(assert, $component.find('.panel .panel-heading .percentage'), 'Percentage should be hidden in anonymous');

  T.exists(assert, $component.find('.panel .answers-wrapper .answer'), 'Missing answers, answers were given');
  T.notExists(assert, $component.find('.panel .answers-wrapper .students'), 'Students should be hidden in anonymous');
});

test('Anonymous and Show Results', function (assert) {
  const selectedQuestion = Resource.create({ //Single Choice
    id: '56a120483b6e7b090501d3e7',
    isResource: false,
    questionType: 'single_choice',
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({value: 1, text: 'Answer 1'}),
      Answer.create({value: 2, text: 'Answer 2'}),
      Answer.create({value: 3, text: 'Answer 3'})
    ]),
    sequence: 1
  });

  let assessment = Ember.Object.create({
    resources: [ selectedQuestion ]
  });

  let reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 1,
            score: 0,
            reaction: 1,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 2,
            score: 0,
            reaction: 5,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 3,
            score: 100,
            reaction: 1,
            savedTime: 1216
          })
        ])
      })
    ]
  });

  let showResult =true;
  this.set('showResult',showResult);
  this.set('selectedQuestion', selectedQuestion);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-question-performance
          reportData=reportData
          anonymous=true
          showResult=showResult
          question=selectedQuestion }}`);

  const $component = this.$();
  const $chart = $component.find('.chart');
  T.exists(assert, $chart, 'Chart information should be visible on anonymous and show result');

  T.exists(assert, $component.find('.panel'), 'Missing panels, answers were given');
  T.exists(assert, $component.find('.panel .panel-heading'), 'Missing panel headers, answers were given');
  T.notExists(assert, $component.find('.panel .panel-heading .percentage'), 'Percentage should be hidden in anonymous');

  T.exists(assert, $component.find('.panel .answers-wrapper .answer'), 'Missing answers, answers were given');
  T.exists(assert, $component.find('.panel .answers-wrapper .answer-percentage'), 'Missing percentage section');
  T.exists(assert, $component.find('.panel .answers-wrapper .answer-chart'), 'Missing percentage chart');
  T.notExists(assert, $component.find('.panel .answers-wrapper .students'), 'Students should be hidden in anonymous');
});


test('Single choice', function (assert) {
  const selectedQuestion = Resource.create({ //Single Choice
    id: '56a120483b6e7b090501d3e7',
    isResource: false,
    questionType: 'single_choice',
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({value: 1, text: 'Answer 1'}),
      Answer.create({value: 2, text: 'Answer 2'}),
      Answer.create({value: 3, text: 'Answer 3'})
    ]),
    sequence: 1
  });

  let assessment = Ember.Object.create({
    resources: [ selectedQuestion ]
  });

  let reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 1,
            score: 0,
            reaction: 1,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 2,
            score: 0,
            reaction: 5,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 3,
            score: 100,
            reaction: 1,
            savedTime: 1216
          })
        ])
      })
    ]
  });

  this.set('selectedQuestion', selectedQuestion);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-question-performance
          reportData=reportData
          question=selectedQuestion }}`);

  const $component = this.$();
  const $chart = $component.find('.chart');
  T.exists(assert, $chart, 'Missing chart');
  T.exists(assert, $chart.find('.gru-x-bar-chart'), 'Missing gru-x-bar-chart');

  T.exists(assert, $component.find('.overall-completion'), 'Missing overal-performance');
  assert.equal(T.text($component.find('.overall-completion')), '3/3', 'Wrong completion text');

  assert.equal($component.find('.panel').length, 3, 'Missing panels, 3 answers were given');
  assert.equal($component.find('.panel .panel-heading').length, 3, 'Missing panel headers, 3 answers were given');

  assert.equal($component.find('.panel.panel-success').length, 1, 'Missing correct panels, 1 correct answers were given');
  assert.equal($component.find('.panel.panel-danger').length, 2, 'Missing incorrect panels, 2 incorrect answers were given');

  assert.equal($component.find('.panel .answers-wrapper .answer').length, 3, 'Missing answers, 3 answers were given');
  assert.equal($component.find('.panel .answers-wrapper .students').length, 3, 'Missing students, 3 answers were given');

  assert.equal($component.find('.panel .answers-wrapper .answer .gru-single-choice').length, 3, 'Missing question type components, 3 answers were given');
});

test('Anonymous and Show Results', function (assert) {
  const selectedQuestion = Resource.create({ //Single Choice
    id: '56a120483b6e7b090501d3e7',
    isResource: false,
    questionType: 'single_choice',
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({value: 1, text: 'Answer 1'}),
      Answer.create({value: 2, text: 'Answer 2'}),
      Answer.create({value: 3, text: 'Answer 3'})
    ]),
    sequence: 1
  });

  let assessment = Ember.Object.create({
    resources: [ selectedQuestion ]
  });

  let reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 1,
            score: 0,
            reaction: 1,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 2,
            score: 0,
            reaction: 5,
            savedTime: 1216
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 3,
            score: 100,
            reaction: 1,
            savedTime: 1216
          })
        ])
      })
    ]
  });

  let showResult =true;
  this.set('showResult',showResult);
  this.set('selectedQuestion', selectedQuestion);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/gru-question-performance
          reportData=reportData
          anonymous=true
          showResult=showResult
          question=selectedQuestion }}`);

  const $component = this.$();
  const $chart = $component.find('.chart');
  T.exists(assert, $chart, 'Chart information should be visible on anonymous and show result');
  T.exists(assert, $component.find('.panel'), 'Missing panels, answers were given');
  T.exists(assert, $component.find('.panel .panel-heading'), 'Missing panel headers, answers were given');
  T.notExists(assert, $component.find('.panel .panel-heading .percentage'), 'Percentage should be hidden in anonymous');
  T.exists(assert, $component.find('.panel .answers-wrapper .answer'), 'Missing answers, answers were given');
  T.exists(assert, $component.find('.panel .answers-wrapper .answer-percentage'), 'Missing percentage section');
  T.exists(assert, $component.find('.panel .answers-wrapper .answer-chart'), 'Missing percentage chart');
  T.notExists(assert, $component.find('.panel .answers-wrapper .students'), 'Students should be hidden in anonymous');
});
