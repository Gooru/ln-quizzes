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
    assignees:[{id:'profile-id'}]
  });
  let profile = Ember.Object.create({
    id: 'id',
    externalId:'externalId'
  });
  component.set('profileService', {
    readProfile: function(profileId) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        if (!profileId) {
          reject({status: 500});
        } else {
          assert.equal(profileId, 'profile-id', 'id should match');
          resolve(profile);
        }
      });
    }
  });
  var done = assert.async();
  component.set('actions.showModal.call', function(component,componentName,model) {
    assert.ok(model.students, 'Missing students');
    assert.ok(model.assignment, 'Missing assignments');
    assert.ok(model.width, 'Missing width');
    assert.ok(model.callback, 'Missing callback');
    assert.equal(componentName, 'gru-assign-student-modal', 'Component name should match');
    done();
  });
  component.send('addStudent', assignment);
});

test('openActions', function(assert) {
  let component = this.subject();
  let assignment = Ember.Object.create({
    id: 'id'
  });
  component.send('openActions',assignment);
  assert.equal(component.get('actualAssignment'), assignment, 'Incorrect actual assignment');
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
test('openPlayer', function(assert) {
  let component = this.subject();
  let assignment = Ember.Object.create({
    id: 'id'
  });
  component.set('router', {
    transitionTo: function(route, contextId) {
      assert.equal(route, 'player', 'Route should match');
      assert.equal(contextId, 'id', 'id should match');
    }
  });
  component.send('openPlayer', assignment);
});
test('optionsMobile', function(assert) {
  let component = this.subject();
  component.set('isTeacher',true);
  component.set('actualAssignment', Ember.Object.create({
    id:'assignment-id'
  }));
  assert.equal(component.get('optionsMobile')[0].get('option'),'launch', 'Should have launch option');
  assert.equal(component.get('optionsMobile')[1].get('option'),'assign', 'Should have assign option');
  assert.equal(component.get('optionsMobile')[2].get('option'),'preview', 'Should have preview option');

  //TODO TEST STUDENT VIEW
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
