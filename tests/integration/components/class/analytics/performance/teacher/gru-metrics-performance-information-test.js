import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from "ember";

moduleForComponent('/class/analytics/performance/teacher/gru-metrics-performance-information', 'Integration | Component | /class/analytics/performance/teacher/gru-metrics-sub-header', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
  }
});
test('Metrics performance information Layout', function(assert) {
  assert.expect(3);

  const dataPickerOptionsMock = Ember.A(["score","completion"]);
  const performanceDataMock = Ember.Object.create({
    score: 50,
    timeSpent: 3600,
    completionDone: 16,
    completionTotal: 32
  });

  this.set('dataPickerOptions', dataPickerOptionsMock);
  this.set('performanceData', performanceDataMock);

  this.render(hbs`{{class/analytics/performance/teacher/gru-metrics-performance-information performanceData=performanceData dataPickerOptions=dataPickerOptions}}`);

  const $component = this.$(); //component dom element

  var $score = $component.find(".score");
  T.exists(assert, $score, 'Missing score cell');

  var $completion = $component.find(".gru-completion-chart");
  T.exists(assert, $completion, 'Missing gru-completion-chart component');

  var $studyTime = $component.find(".study-time");
  T.notExists(assert, $studyTime, "study time cell shouldn't be visible");

});
