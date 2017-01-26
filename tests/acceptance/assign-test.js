import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import Ember from 'ember';

moduleForAcceptance('Acceptance | assign');

test('Create Context', function(assert) {
  visit('/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/assessment/assessment-id');
    var $studentRosterTab = Ember.$('.qz-assign-students .nav-tabs .student-roster a');
    click($studentRosterTab);
    andThen(function () {
      var $student = Ember.$('.qz-assign-students .students .student-list .list-group-item:eq(1)');
      click($student);
      andThen(function () {
        assert.equal( Ember.$('.qz-assign-students .students .list-container .student-list .list-group-item.selected').length,1, 'One student should be selected');
        assert.equal(Ember.$('.selected-count').text(),'Selected 1 of 3','Incorrect selected count');
        fillIn(Ember.$('#date-dueDate'), '12/10/2200');
        var $assignButton = Ember.$('button.assign-btn');
        click($assignButton);
        andThen(function () {
          assert.equal( Ember.$('.qz-assign-students .students .list-container .student-list .list-group-item.selected').length,0, 'Assignment list should be clean');
        });
      });
    });
  });
});
