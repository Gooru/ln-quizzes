import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import QuestionResult from 'gooru-web/models/result/question';
import UserResourcesResult from 'gooru-web/models/result/user-resources';
import ReportData from 'gooru-web/models/result/report-data';
import T from 'gooru-web/tests/helpers/assert';

moduleForComponent('reports/class-assessment/gru-student-view', 'Integration | Component | reports/class assessment/gru student view', {
  integration: true
});

test('Layout', function (assert) {

  var assessment = Ember.Object.create({
    resources: [
      Ember.Object.create({
        "id": "56a120483b6e7b090501d3e7",
        "order": 1
      }),
      Ember.Object.create({
        "id": "56a1204886b2e565e1b2c230",
        "order": 3
      }),
      Ember.Object.create({
        "id": "56a12048ddee2022a741356a",
        "order": 2
      })
    ]
  });

  var students = Ember.A([
    Ember.Object.create({"id": "56983a9060a68052c1ed934c","fullName":"Lorena Prendas Chavarria"}),
    Ember.Object.create({"id": "56983a90fb01fecc328e2388" ,"fullName":"Andres Charpentier Zuñiga"}),
    Ember.Object.create({"id": "56983a906596902edadedc7c" ,"fullName":"David Zumbado Alfaro"})
  ]);

  var reportData = ReportData.create({
    students: students,
    resources: assessment.get("resources")
  });

  reportData.merge([
    UserResourcesResult.create({
      user: "56983a9060a68052c1ed934c",
      resourceResults: Ember.A([
        QuestionResult.create({resourceId: "56a120483b6e7b090501d3e7", correct: true}),
        QuestionResult.create({resourceId: "56a1204886b2e565e1b2c230", correct: true}),
        QuestionResult.create({resourceId: "56a12048ddee2022a741356a", correct: true})
      ])
    }),
    UserResourcesResult.create({
      user: "56983a90fb01fecc328e2388",
      resourceResults: Ember.A([
        QuestionResult.create({resourceId: "56a120483b6e7b090501d3e7", correct: true}),
        QuestionResult.create({resourceId: "56a1204886b2e565e1b2c230", correct: true}),
        QuestionResult.create({resourceId: "56a12048ddee2022a741356a", correct: false})
      ])
    }),
    UserResourcesResult.create({
      user: "56983a906596902edadedc7c",
      resourceResults: Ember.A([
        QuestionResult.create({resourceId: "56a120483b6e7b090501d3e7", correct: true}),
        QuestionResult.create({resourceId: "56a1204886b2e565e1b2c230", correct: false}),
        QuestionResult.create({resourceId: "56a12048ddee2022a741356a", correct: false})
      ])
    })
  ]);

  this.set("assessment", assessment);
  this.set("students", students);
  this.set("reportData", reportData);

  this.render(hbs`{{reports/class-assessment/gru-student-view assessment=assessment students=students reportData=reportData}}`);

  const $component = this.$();
  T.exists(assert, $component.find(".sort-section"), "Sort section missing");
  const $avrgSortBtn =$component.find(".sort-section button.sort-average");
  const $alphabeticalSortBtn =$component.find(".sort-section button.sort-alphabetical");
  T.exists(assert, $avrgSortBtn, "Missing sort by average");
  T.exists(assert, $alphabeticalSortBtn, "Missing sort alphabetically");
  assert.equal($component.find(".gru-student-performance-box").length, 3, "It should displayed 3 boxes");


  $firstStudentPerformanceBox = $component.find(".gru-student-performance-box:first-child");


  assert.equal(T.text($firstStudentPerformanceBox.find(".panel-heading")), "Lorena Prendas Chavarria (100%)", "It should say Lorena Prendas Chavarria (100%)");

  $lastStudentPerformanceBox = $component.find(".gru-student-performance-box:last-child");

  assert.equal(T.text($lastStudentPerformanceBox.find(".panel-heading")), "David Zumbado Alfaro (33%)", "It should say David Zumbado Alfaro (33%)");

  $alphabeticalSortBtn.click();

  let $firstStudentPerformanceBox = $component.find(".gru-student-performance-box:first-child");

  assert.equal(T.text($firstStudentPerformanceBox.find(".panel-heading")), "Andres Charpentier Zuñiga (67%)", "It should say Andres Charpentier Zuñiga");

  let $lastStudentPerformanceBox = $component.find(".gru-student-performance-box:last-child");
  assert.equal(T.text($lastStudentPerformanceBox.find(".panel-heading")), "Lorena Prendas Chavarria (100%)", "It should say Lorena Prendas Chavarria");

});
