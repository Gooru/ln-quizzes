import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assessments-list', 'Integration | Component | gru assessments list', {
  integration: true
});

test('Layout', function(assert) {

  this.render(hbs`{{gru-assessments-list}}`);

  var $assessmentListComponent = this.$();
  assert.ok($assessmentListComponent.find('.gru-assessments-list .header').length, 'Missing header section');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .header .search .search-keyword input').length, 'Missing search input');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .header .search .search-keyword .search-icon').length, 'Missing search icon');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .header .views').length, 'Missing views section');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .header .views .standards-btn').length, 'Missing standards button');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .header .views .btn-group').length, 'Missing view options');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .assessment-list-container .assessment-list').length, 'Missing assessment list section');
  assert.ok($assessmentListComponent.find('.gru-assessments-list .assessment-list-container .assessment-info').length, 'Missing assessment information section');
});
