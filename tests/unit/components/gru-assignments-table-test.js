import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('gru-assignments-table', 'Unit | Component | gru assignments table', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('addStudent', function(assert) {
  let component = this.subject();
  let assignment = Ember.Object.create({
    id: 'id',
    assignees:[]
  });
  let expectedModel = {
    students: [],
    collection: assignment,
    width:'825px'
  };
  component.set('students', 'students');
  component.set('students', 'students');
  component.set('actions.showModal', function(componentName, model) {
    assert.deepEqual(model, expectedModel, 'Model should match');
    assert.equal(componentName, 'gru-assign-student-modal', 'Component name should match');
  });
  component.send('addStudent', assignment);
});

test('openActions', function(assert) {
  let component = this.subject();
  component.send('openActions');
  assert.equal(component.get('showMenu'), true, 'Actions menu should be visible');
});

test('openRealTime', function(assert) {
  let component = this.subject();
  let assignment = Ember.Object.create({
    id: 'id'
  });
  component.set('router', {
    transitionTo: function(route, contextId) {
      assert.equal(route, 'reports.context', 'Route should match');
      assert.equal(contextId, 'id', 'id should match');
    }
  });
  component.send('openRealTime', assignment);
});

test('selectAssignment', function(assert) {
  let component = this.subject();
  let expectedAssignment = Ember.Object.create({
    id: 'id',
    selected: false
  });
  let selectedAssignment = Ember.Object.create({
    selected: true
  });
  component.set('assignments', Ember.Object.create({
    findBy: function(property, value) {
      assert.equal(property, 'selected', 'Should find by selected property');
      assert.ok(value, 'Should find the value true');
      return selectedAssignment;
    }
  }));
  component.set('sendAction', function(actionName, assignment) {
    assert.equal(actionName, 'onSelectAssignment', 'Action sent should match');
    assert.deepEqual(assignment, expectedAssignment, 'Assignment should match');
  });
  component.send('selectAssignment', expectedAssignment);
  assert.ok(expectedAssignment.get('selected'), 'Assignment should be selected');
  assert.notOk(selectedAssignment.get('selected'), 'Previously selected Assignment should not be selected');
});

test('sortBy', function(assert) {
  let component = this.subject();
  component.set('reverseSort', false);
  component.set('sortBy', '');
  component.send('sortBy', 'criteria');
  assert.equal(component.get('sortBy'), 'criteria', 'Sort by value should match');
  assert.notOk(component.get('reverseSort'), 'Reverse sort value should match');
  component.send('sortBy', 'criteria');
  assert.equal(component.get('sortBy'), 'criteria', 'Sort by value should match');
  assert.ok(component.get('reverseSort'), 'Reverse sort value should match');
});
