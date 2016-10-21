import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

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
