import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import T from 'quizzes/tests/helpers/assert';
import Context from 'quizzes/models/context/context';

const contextServiceStub = Ember.Service.extend({

  createContext(assignment) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!assignment) {
        reject({status: 500});
      } else {
        resolve(assignment);
      }
    });
  },
  updateContext(assignment) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!assignment) {
        reject({status: 500});
      } else {
        resolve(assignment);
      }
    });
  }

});

moduleForComponent('gru-assign-students', 'Integration | Component | gru assign students', {
  integration: true,
  beforeEach: function () {
    this.register('service:api-sdk/context', contextServiceStub);
    this.inject.service('api-sdk/context');
  }
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
  assert.ok($assignStudentsComponent.find('.gru-assign-students .actions .cancel-btn').length, 'Missing cancel button');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .actions .assign-btn').length, 'Missing assign button');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .actions .cancel-btn').length, 'Missing cancel button');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .nav-tabs .assessment-settings').length, 'Missing Assessment Settings Tab');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .nav-tabs .student-roster').length, 'Missing Student Roster Tab');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .date-options').length, 'Missing Date Option section');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .date-options .available-from').length, 'Missing Available From section');
  assert.ok($assignStudentsComponent.find('.gru-assign-students .date-options .due-date').length, 'Missing Due Date section');
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
  var $studentRosterTab = $assignStudentsComponent.find('.gru-assign-students .nav-tabs .student-roster a');
  $studentRosterTab.click();
  return wait().then(function () {
    var $searchInput = $assignStudentsComponent.find('.gru-assign-students .students .students-header .search-navigation input');
    $searchInput.val('firstname-2');
    $searchInput.first().keyup();
    return wait().then(function () {
      assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item:visible').length,1, 'Should have only 1 student');
    });
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
  var $studentRosterTab = $assignStudentsComponent.find('.gru-assign-students .nav-tabs .student-roster a');
  $studentRosterTab.click();
  return wait().then(function () {
    var $selectAll = $assignStudentsComponent.find('.gru-assign-students .students .list-container .select-all');
    $selectAll.click();
    return wait().then(function () {
      assert.ok($assignStudentsComponent.find('.gru-assign-students .list-container .select-all.selected').length, 'Select all button should be selected');
      assert.equal($assignStudentsComponent.find('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,3, 'All students should be selected');
    });
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
  var $studentRosterTab = $assignStudentsComponent.find('.gru-assign-students .nav-tabs .student-roster a');
  $studentRosterTab.click();
  return wait().then(function () {
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
});
test('Cancel assign students', function(assert) {

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

  this.on('parentAction', function(){
    assert.ok(true, "Should call onCloseModal");
  });
  this.render(hbs`{{gru-assign-students students=students onCloseModal='parentAction'}}`);

  var $component = this.$(); //component dom element
  var $studentRosterTab = $component.find('.gru-assign-students .nav-tabs .student-roster a');
  $studentRosterTab.click();
  return wait().then(function () {
    var $cancelButton = $component.find(".actions .cancel-btn");
    $cancelButton.click();
  });
});

test('Timestamp due date with due date less than the assigned date', function(assert) {

  let context = Context.create(Ember.getOwner(this).ownerInjection(),{
    title:this.get('collection.title')
  });

  this.set('assignment',context);
  this.render(hbs`{{gru-assign-students assignment=assignment}}`);
  var $component = this.$();
  var $studentRosterTab = $component.find('.gru-assign-students .nav-tabs .student-roster a');
  $studentRosterTab.click();
  return wait().then(function () {
    var $inputDueDate = $component.find('#datedueDate');
    var $inputDueDateTime = $component.find('#timedueDate');

    var $inputAvailableDate = $component.find('#dateavailableDate');
    var $inputAvailableTime = $component.find('#timeavailableDate');

    T.exists(assert, $inputAvailableDate, 'Assigned date input element not found');
    T.exists(assert, $inputDueDate, 'Due date input element not found');
    T.exists(assert, $inputAvailableTime, 'Assigned time input element not found');
    T.exists(assert, $inputDueDateTime, 'Due date time input element not found');

    $inputDueDate.val('10/21/2200');
    $inputDueDate.blur();

    $inputDueDateTime.val('12:31 PM');
    $inputDueDateTime.blur();

    $component.find('.assign-btn').click();
    return wait().then(function () {
      assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');
      $inputAvailableDate.val('10/21/2200');
      $inputAvailableDate.blur();

      $inputAvailableTime.val('12:30 PM');
      $inputAvailableTime.blur();
      return wait().then(function () {
        assert.ok(!$component.find(".error-messages .error").length, 'Input error message was hidden');
        $inputDueDate.val('10/21/2200');
        $inputDueDate.blur();

        $inputDueDateTime.val('10:00 AM');
        $inputDueDateTime.blur();
        return wait().then(function () {
          assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');
        });
      });
    });
  });
});
