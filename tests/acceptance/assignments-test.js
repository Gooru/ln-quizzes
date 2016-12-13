import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import T from 'quizzes/tests/helpers/assert';
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

test('visiting assignments', function(assert) {
  visit('/profile/profile-id?isTeacher=true');

  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=true');
    const $addStudent = find('button.add-student');
    click($addStudent);
    andThen(function () {
      T.exists(assert, find('.gru-assign-student-modal'), 'Missing assign student modal');
    });
  });
});
