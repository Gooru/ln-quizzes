import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assignments-list', 'Integration | Component | gru assignments list', {
  integration: true
});

test('Layout', function(assert) {

  this.render(hbs`{{gru-assignments-list}}`);

  var $assessmentListComponent = this.$();
  assert.ok($assessmentListComponent.find('.gru-assignments-list .header').length, 'Missing header section');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .header .search .search-keyword input').length, 'Missing search input');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .header .search .search-keyword .search-icon').length, 'Missing search icon');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .header .views').length, 'Missing views section');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .header .views .standards-btn').length, 'Missing standards button');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .header .views .btn-group').length, 'Missing view options');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .assignments-list-container .assignments-list').length, 'Missing assignments list section');
  assert.ok($assessmentListComponent.find('.gru-assignments-list .assignments-list-container .assignments-info').length, 'Missing assignments information section');
});
