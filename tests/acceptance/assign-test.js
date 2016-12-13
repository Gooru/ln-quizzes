import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | assign',{
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'token-value',
      user: {
        providedAt: Date.now()
      }
    });
  }
});

test('Create Context', function(assert) {
  visit('/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/assessment/assessment-id');
    var $studentRosterTab = Ember.$('.gru-assign-students .nav-tabs .student-roster a');
    click($studentRosterTab);
    andThen(function () {
      var $student = Ember.$('.gru-assign-students .students .student-list .list-group-item:eq(1)');
      click($student);
      andThen(function () {
        assert.equal( Ember.$('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,1, 'One student should be selected');
        assert.equal(Ember.$('.selected-count').text(),'Selected 1 of 3','Incorrect selected count');
        fillIn(Ember.$('#date-availableDate'), '12/10/2200');
        fillIn(Ember.$('#time-availableDate'), '9:30 AM');
        fillIn(Ember.$('#date-dueDate'), '12/10/2200');
        fillIn(Ember.$('#time-dueDate'), '11:3O PM');

        var $assignButton = Ember.$('button.assign-btn');
        click($assignButton);
        andThen(function () {
          //assert.equal( Ember.$('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,0, 'Assignment list should be clean');
        });
      });
    });
  });
});

