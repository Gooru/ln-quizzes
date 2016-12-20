import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import Ember from 'ember';

moduleForAcceptance('Acceptance | assignments',{
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

test('Visiting assignment as teacher', function(assert) {
  visit('/profile/profile-id?isTeacher=true');

  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=true');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.students-assigned:eq(1)').text(),'1','Should have 1 students assigned');
    const $addStudent = find('button.add-student');
    click($addStudent);
    andThen(function () {
      assert.ok(assert, find('.gru-assign-student-modal'), 'Missing assign student modal');
      var $studentRosterTab = Ember.$('.gru-assign-students .nav-tabs .student-roster a');
      click($studentRosterTab);
      andThen(function () {
        var $student = Ember.$('.gru-assign-students .students .student-list .list-group-item:eq(1)');
        click($student);
        andThen(function () {
          assert.equal( Ember.$('.gru-assign-students .students .list-container .student-list .list-group-item.selected').length,2, 'One student should be selected');
          assert.equal(Ember.$('.selected-count').text(),'Selected 2 of 3','Incorrect selected count');
          fillIn(Ember.$('#date-dueDate'), '12/10/2200');
          var $assignButton = Ember.$('button.assign-btn');
          click($assignButton);
          andThen(function () {
            var $table = find('.gru-assignments-table table');
            assert.equal($table.find('td.students-assigned:eq(1)').text(),'1','Should have 1 students assigned');
            var $assignment = $table.find('tbody td:eq(1)');
            click($assignment);
            andThen(function () {
              var $detail = find('.gru-assignments-detail');
              assert.equal($detail.find('.due-date').text().trim(), 'Due Date: 11:30 pm 12/10/2200','Incorrect due date');
            });
          });
        });
      });
    });
  });
});
test('Visiting assignment as teacher and sort by title', function(assert) {
  visit('/profile/profile-id?isTeacher=true');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=true');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.title:eq(0)').text(),'Context title','Incorrect assignment 1');
    assert.equal($table.find('td.title:eq(1)').text(),'assignment title','Incorrect assignment 2');
    const $titleHeader = $table.find('th.title-header a');
    click($titleHeader);//remove sort default and sort by title asc
    andThen(function () {
      assert.equal($table.find('td.title:eq(0)').text(),'assignment title','Incorrect assignment 1 after sort asc');
      assert.equal($table.find('td.title:eq(1)').text(),'Context title','Incorrect assignment 2 after sort asc');
      const $titleHeader = $table.find('th.title-header a');
      click($titleHeader);//sort by title desc
      andThen(function () {
        assert.equal($table.find('td.title:eq(0)').text(),'Context title','Incorrect assignment 1 after sort desc');
        assert.equal($table.find('td.title:eq(1)').text(),'assignment title','Incorrect assignment 2 after sort desc');
      });
    });
  });
});

test('Visiting assignment as teacher and sort by created date', function(assert) {
  visit('/profile/profile-id?isTeacher=true');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=true');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.title:eq(0)').text(),'Context title','Incorrect assignment 1');
    assert.equal($table.find('td.title:eq(1)').text(),'assignment title','Incorrect assignment 2');
    const $titleHeader = $table.find('th.num-header a');
    click($titleHeader);//remove sort default and sort by created date asc
    andThen(function () {
      assert.equal($table.find('td.title:eq(0)').text(),'assignment title','Incorrect assignment 1 after sort asc');
      assert.equal($table.find('td.title:eq(1)').text(),'Context title','Incorrect assignment 2 after sort asc');
      const $titleHeader = $table.find('th.num-header a');
      click($titleHeader);//sort by created date desc
      andThen(function () {
        assert.equal($table.find('td.title:eq(0)').text(),'Context title','Incorrect assignment 1 after sort desc');
        assert.equal($table.find('td.title:eq(1)').text(),'assignment title','Incorrect assignment 2 after sort desc');
      });
    });
  });
});

test('Visiting assignment as teacher and sort by modified date', function(assert) {
  visit('/profile/profile-id?isTeacher=true');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=true');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.title:eq(0)').text(),'Context title','Incorrect assignment 1');
    assert.equal($table.find('td.title:eq(1)').text(),'assignment title','Incorrect assignment 2');
    const $titleHeader = $table.find('th.modified-date-header a');
    click($titleHeader);//remove sort default and sort by created date asc
    andThen(function () {
      assert.equal($table.find('td.title:eq(0)').text(),'assignment title','Incorrect assignment 1 after sort asc');
      assert.equal($table.find('td.title:eq(1)').text(),'Context title','Incorrect assignment 2 after sort asc');
      const $titleHeader = $table.find('th.modified-date-header a');
      click($titleHeader);//sort by modified date desc
      andThen(function () {
        assert.equal($table.find('td.title:eq(0)').text(),'Context title','Incorrect assignment 1 after sort desc');
        assert.equal($table.find('td.title:eq(1)').text(),'assignment title','Incorrect assignment 2 after sort desc');
      });
    });
  });
});

test('Visiting assignment as student and play assignment', function(assert) {
  visit('/profile/profile-id?isTeacher=false');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=false');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('tbody tr').length,2,'Should have 2 context assigned');
    assert.ok(find('.assignments-info.hide').length,'Assignment detail should be hide');
    const $assignment = $table.find('tbody tr:eq(0)');
    click($assignment);
    andThen(function () {
      assert.notOk(find('.assignments-info.hide').length,'Assignment detail should not be hide');
      assert.ok(find('.assignments-info.show').length,'Assignment detail should be visible');
      const $playButton = find('.assignments-info .actions button.play');
      click($playButton);
      andThen(function () {
        assert.equal(currentURL(), '/player/assignment-id2');
      });
    });
  });
});

test('Visiting assignment as student and sort by title', function(assert) {
  visit('/profile/profile-id?isTeacher=false');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=false');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.title:eq(0)').text(),'Business 2','Incorrect assignment 1');
    assert.equal($table.find('td.title:eq(1)').text(),'Assignment for student','Incorrect assignment 2');
    const $titleHeader = $table.find('th.title-header a');
    click($titleHeader);//remove sort default and sort by title asc
    andThen(function () {
      assert.equal($table.find('td.title:eq(0)').text(),'Assignment for student','Incorrect assignment 1');
      assert.equal($table.find('td.title:eq(1)').text(),'Business 2','Incorrect assignment 2');
      const $titleHeader = $table.find('th.title-header a');
      click($titleHeader);//sort by title desc
      andThen(function () {
        assert.equal($table.find('td.title:eq(0)').text(),'Business 2','Incorrect assignment 1 after sort');
        assert.equal($table.find('td.title:eq(1)').text(),'Assignment for student','Incorrect assignment 2 after sort');
      });
    });
  });
});

test('Visiting assignment as student and sort by due date', function(assert) {
  visit('/profile/profile-id?isTeacher=false');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=false');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.title:eq(0)').text(),'Business 2','Incorrect assignment 1');
    assert.equal($table.find('td.title:eq(1)').text(),'Assignment for student','Incorrect assignment 2');
    const $dueDateHeader = $table.find('th.date-header a');
    click($dueDateHeader);//remove sort default and sort by due date asc
    andThen(function () {
      assert.equal($table.find('td.title:eq(0)').text(),'Business 2','Incorrect assignment 1 after sort asc');
      assert.equal($table.find('td.title:eq(1)').text(),'Assignment for student','Incorrect assignment 2 after sort asc');
      const $dueDateHeader = $table.find('th.date-header a');
      click($dueDateHeader);//sort by due date desc
      andThen(function () {
        assert.equal($table.find('td.title:eq(0)').text(),'Assignment for student','Incorrect assignment 1 after sort desc');
        assert.equal($table.find('td.title:eq(1)').text(),'Business 2','Incorrect assignment 2 after sort desc');
      });
    });
  });
});

test('Visiting assignment as student and sort by created date', function(assert) {
  visit('/profile/profile-id?isTeacher=false');
  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=false');
    var $table = find('.gru-assignments-table table');
    assert.equal($table.find('td.title:eq(0)').text(),'Business 2','Incorrect assignment 1');
    assert.equal($table.find('td.title:eq(1)').text(),'Assignment for student','Incorrect assignment 2');
    const $dueDateHeader = $table.find('th.num-header a');
    click($dueDateHeader);//remove sort default and sort by due date asc
    andThen(function () {
      assert.equal($table.find('td.title:eq(0)').text(),'Assignment for student','Incorrect assignment 1 after sort asc');
      assert.equal($table.find('td.title:eq(1)').text(),'Business 2','Incorrect assignment 2 after sort asc');
      const $dueDateHeader = $table.find('th.num-header a');
      click($dueDateHeader);//sort by created date desc
      andThen(function () {
        assert.equal($table.find('td.title:eq(0)').text(),'Business 2','Incorrect assignment 1 after sort desc');
        assert.equal($table.find('td.title:eq(1)').text(),'Assignment for student','Incorrect assignment 2 after sort desc');
      });
    });
  });
});

//TODO SORT BY SCORE AND SORT BY ATTEMPTS FOR STUDENTS
