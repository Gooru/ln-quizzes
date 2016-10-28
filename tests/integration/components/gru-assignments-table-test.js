import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('gru-assignments-table', 'Integration | Component | gru assignments table', {
  integration: true
});

test('it renders', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment 1',
      standards:'',
      assignedDate:'27/10/2016',
      dueDate:'2/11,2016',
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'Assessment 2',
      standards:'',
      assignedDate:'27/10/2016',
      dueDate:'3/11,2016',
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments}}`);

  var $assignmentTable = this.$();
  assert.ok($assignmentTable.find('.gru-assignments-table table').length, 'Missing table');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.num-header').length, 'Missing Num Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.score-header').length, 'Missing Score Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.title-header').length, 'Missing title Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.standards-header').length, 'Missing standards Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.date-header').length, 'Missing Due date Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.attempts-header').length, 'Missing Attempts Header');
  assert.equal($assignmentTable.find('.gru-assignments-table table tbody tr').length,2, 'Should have 2 rows');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.num').length,'Missing num column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.score').length,'Missing score column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.title').length,'Missing title column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.standards').length,'Missing standards column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.due-date').length,'Missing due date column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.attempts').length,'Missing attempts column');
});
