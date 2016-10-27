import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
moduleForComponent('gru-assign-students', 'Integration | Component | gru assign students', {
  integration: true
});

test('Assign students Layout', function(assert) {
  var students = Ember.A([
    Ember.Object.create({
      firstName:'firstname-1',
      lastName:'lastname-1',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-2',
      lastName:'lastname-2',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-3',
      lastName:'lastname-3',
      isSelected:false
    })
  ]);
  this.set('students',students);

  this.render(hbs`{{gru-assign-students students=students}}`);
  var $assignStudentsComponent = this.$();
  assert.ok($assignStudentsComponent.find('.gru-assign-students h5').length, 'Missing title');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .students .students-header span').length, 'Missing title on student list section ');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .students .students-header .search-navigation .search-icon').length, 'Missing search icon');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .students .students-header .search-navigation input').length, 'Missing search input');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .students .list-container .select-all').length, 'Missing select all option');
  assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .select-all span').text(),'Select all ('+students.length+')', 'Incorrect students count');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list').length, 'Missing student list');
  assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item').length,3, 'Should have 3 students');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .selected-count').length, 'Missing selected count');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .assessment-settings').length, 'Missing assessment settings');

});
test('Filter by name', function(assert) {
  var students = Ember.A([
    Ember.Object.create({
      firstName:'firstname-1',
      lastName:'lastname-1',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-2',
      lastName:'lastname-2',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-3',
      lastName:'lastname-3',
      isSelected:false
    })
  ]);
  this.set('students',students);

  this.render(hbs`{{gru-assign-students students=students}}`);
  var $assignStudentsComponent = this.$();
  var $searchInput = $assignStudentsComponent.find('.gru-assign-students .students .students-header .search-navigation input');
  $searchInput.val('firstname-2');
  $searchInput.first().keyup();
  return wait().then(function () {
    assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item:visible').length,1, 'Should have only 1 student');
  });
});
test('Select All Students', function(assert) {
  var students = Ember.A([
    Ember.Object.create({
      firstName:'firstname-1',
      lastName:'lastname-1',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-2',
      lastName:'lastname-2',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-3',
      lastName:'lastname-3',
      isSelected:false
    })
  ]);
  this.set('students',students);

  this.render(hbs`{{gru-assign-students students=students}}`);
  var $assignStudentsComponent = this.$();
  var $selectAll = $assignStudentsComponent.find('.gru-assign-students .students .list-container .select-all');
  $selectAll.click();
  return wait().then(function () {
    assert.ok($assignStudentsComponent.find('.gru-assign-students .list-container .select-all.selected').length, 'Select all button should be selected');
    assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,3, 'All students should be selected');
  });
});

test('Selected and Unselected Student', function(assert) {
  var students = Ember.A([
    Ember.Object.create({
      firstName:'firstname-1',
      lastName:'lastname-1',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-2',
      lastName:'lastname-2',
      isSelected:false
    }),
    Ember.Object.create({
      firstName:'firstname-3',
      lastName:'lastname-3',
      isSelected:false
    })
  ]);
  this.set('students',students);

  this.render(hbs`{{gru-assign-students students=students}}`);
  var $assignStudentsComponent = this.$();
  var $student = $assignStudentsComponent.find('.gru-assign-students .students .student-list .list-group-item:eq(1)');
  $student.click();
  return wait().then(function () {
    assert.notOk($assignStudentsComponent.find('.gru-assign-students .list-container .select-all.selected').length, 'Select all button should not be selected');
    assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,1, 'Only one student should be selected');
    var $student = $assignStudentsComponent.find('.gru-assign-students .students .student-list .list-group-item:eq(1)');
    $student.click();
    return wait().then(function () {
      assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,0, 'All students should be unselected');
    });
  });
});