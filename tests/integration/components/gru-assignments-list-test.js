import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

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
  assert.ok($assessmentListComponent.find('.gru-assignments-list .assignments-list-container .assignments-info.hide').length, 'Missing assignments information section');
});
test('Filter by term', function(assert) {
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
  var $assignmentsListComponent = this.$();
  var $searchInput = $assignmentsListComponent.find('.gru-assignments-list .header .search-navigation input');
  $searchInput.val('Assessment 2');
  $searchInput.first().keyup();
  return wait().then(function () {
    assert.equal($assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table table tbody tr:visible').length,1, 'Should have only 1 assignment');
  });
});
test('Select assignment', function(assert) {
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
  var $assignmentsListComponent = this.$();
  var $assignment = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table tbody tr:eq(1)');
  $assignment.click();
  return wait().then(function () {
    assert.ok($assignmentsListComponent.find('.gru-assignments-list .assignments-list-container .assignments-info.show').length, 'Assignment information section should appear');
    assert.ok($assignmentsListComponent.find($assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table tbody tr:eq(1)')).hasClass("selected"), 'Assignment row should be selected');
  });
});
test('Default sort: Sort by assigned date', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment B 2',
      standards:'',
      assignedDate:1463807150,
      dueDate:1465516800,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'',
      standards:'Assessment A 1',
      assignedDate:1465516800,
      dueDate:1467259800,
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments}}`);
  var $assignmentsListComponent = this.$();
  var $table = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table');
  assert.equal($table.find('tbody tr:eq(0) .title').text(),'Assessment B 2', 'Assessment B is the most recent assigned');
});
test('Sort by title', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Collection',
      standards:'',
      assignedDate:1463807150,
      dueDate:1465516800,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'Assessment',
      standards:'',
      assignedDate:1465516800,
      dueDate:1467259800,
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments}}`);
  var $assignmentsListComponent = this.$();
  var $table = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table');
  var $titleHeader = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table thead .title-header a');
  $titleHeader.click();
  return wait().then(function () {
    assert.equal($table.find('tbody tr:eq(0) .title').text(),'Assessment', 'The first sorted by title should be Assessment');
    $titleHeader.click();
    return wait().then(function () {
      assert.equal($table.find('tbody tr:eq(0) .title').text(),'Collection', 'The first sorted by title should be Collection');
    });
  });
});
test('Sort by score', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment 1',
      standards:'',
      assignedDate:1463807150,
      dueDate:1465516800,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'Assessment 2',
      standards:'',
      assignedDate:1465516800,
      dueDate:1467259800,
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments}}`);
  var $assignmentsListComponent = this.$();
  var $table = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table');
  var $scoreHeader = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table thead .score-header a');
  $scoreHeader.click();
  return wait().then(function () {
    assert.equal($table.find('tbody tr:eq(0) .title').text(),'Assessment 2', 'The first sorted by score should be Assessment 2');
    $scoreHeader.click();
    return wait().then(function () {
      assert.equal($table.find('tbody tr:eq(0) .title').text(),'Assessment 1', 'The first sorted by score should be Assessment 1');
    });
  });
});
test('Sort by Assigned Date', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment 1',
      standards:'',
      assignedDate:1463807150,
      dueDate:1465516800,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'Assessment 2',
      standards:'',
      assignedDate:1465516800,
      dueDate:1463807150,
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments}}`);
  var $assignmentsListComponent = this.$();
  var $table = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table');
  var $numHeader = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table thead .num-header a');
  $numHeader.click();
  return wait().then(function () {
    assert.equal($table.find('tbody tr:eq(0) .title').text(),'Assessment 2', 'The first sorted by assigned date should be Assessment 2');
    $numHeader.click();
    return wait().then(function () {
      assert.equal($table.find('tbody tr:eq(0) .title').text(),'Assessment 1', 'The first sorted by assigned date should be Assessment 1');
    });
  });
});

test('Sort by Due Date', function(assert) {
  var assignments = Ember.A([
    Ember.Object.create({
      hasStarted:true,
      score:60,
      title:'Assessment 1',
      standards:'',
      assignedDate:1463807150,
      dueDate:1465516800,
      totalAttempts:15,
      attempts:2
    }),
    Ember.Object.create({
      hasStarted:true,
      score:10,
      title:'Assessment 2',
      standards:'',
      assignedDate:1465516800,
      dueDate:1463807150,
      totalAttempts:15,
      attempts:2
    })]);
  this.set('assignments',assignments);

  this.render(hbs`{{gru-assignments-list assignments=assignments}}`);
  var $assignmentsListComponent = this.$();
  var $table = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table');
  var $dueDateHeader = $assignmentsListComponent.find('.gru-assignments-list .gru-assignments-table thead .date-header a');
  $dueDateHeader.click();
  return wait().then(function () {
    assert.equal($table.find('tbody tr:eq(0) .due-date').text(),'4:36 pm 01/17/1970', 'The first sorted by due date should be 4:36 pm 01/17/1970');
    $dueDateHeader.click();
    return wait().then(function () {
      assert.equal($table.find('tbody tr:eq(0) .due-date').text(),'5:05 pm 01/17/1970', 'The first sorted by due date should be 5:05 pm 01/17/1970');
    });
  });
});
