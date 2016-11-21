import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('gru-assignments-table', 'Integration | Component | gru assignments table', {
  integration: true
});

test('Table layout student', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment 1',
      standards:'',
      assignedDate:1475859664000,
      dueDate:1475859664000,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:70,
      title:'Assessment 2',
      standards:'',
      assignedDate:1475859664000,
      dueDate:1475859664000,
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
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.modified-date-header').length, 'Modified Date Header should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.students-assigned-header').length, 'Students Assigned Header should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.actions-header').length, 'Actions Header should not appear');
  assert.equal($assignmentTable.find('.gru-assignments-table table tbody tr').length,2, 'Should have 2 rows');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.num').length,'Missing num column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.score').length,'Missing score column');
  assert.equal($assignmentTable.find('.gru-assignments-table table tbody tr:nth-child(2) td.score span.score').attr('style'),'background-color: #F8BA41','Incorrect score background color');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.title').length,'Missing title column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.standards').length,'Missing standards column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.due-date').length,'Missing due date column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.attempts').length,'Missing attempts column');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.modified-date').length,'Modify date  column should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.students-assigned').length,'Students assigned  column should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.actions button.add-student').length,'Add student button should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.actions button.real-time').length,'Real time button sould not appear');
});

test('Table layout teacher', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment 1',
      standards:'',
      createdDate:1463807150,
      modifiedDate:1478538064000,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'Assessment 2',
      standards:'',
      createdDate:1475859664000,
      modifiedDate:1475859664000,
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments isTeacher=true}}`);

  var $assignmentTable = this.$();
  assert.ok($assignmentTable.find('.gru-assignments-table table').length, 'Missing table');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.num-header').length, 'Missing Num Header');
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.score-header').length, 'Score Header should not appear');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.title-header').length, 'Missing title Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.modified-date-header').length, 'Missing Modified Date Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.students-assigned-header').length, 'Missing Students Assigned Header');
  assert.ok($assignmentTable.find('.gru-assignments-table table thead tr th.actions-header').length, 'Missing Actions Header');
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.standards-header').length, 'Standards Header should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.date-header').length, 'Due date Header should not appear');
  assert.notOk($assignmentTable.find('.gru-assignments-table table thead tr th.attempts-header').length, 'Attempts Header should not appear');
  assert.equal($assignmentTable.find('.gru-assignments-table table tbody tr').length,2, 'Should have 2 rows');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.num').length,'Missing num column');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.score').length,'Score column should not appear');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.title').length,'Missing title column');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.standards').length,'Missing standards column');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.due-date').length,'Missing due date column');
  assert.notOk($assignmentTable.find('.gru-assignments-table table tbody tr td.attempts').length,'Missing attempts column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.modified-date').length,'Missing modify date  column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.students-assigned').length,'Missing students assigned  column');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.actions button.add-student').length,'Missing add student button');
  assert.ok($assignmentTable.find('.gru-assignments-table table tbody tr td.actions button.real-time').length,'Missing real time button');

});
