import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | integration', {
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


test('teams route to info', function(assert) {
  visit('/integration/teams?token=invalid-token&classId=class-for-pochita-as-teacher&page=info');
  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/sign-in');
  });
});


test('teams route to incorrect page', function(assert) {
  visit('/integration/teams?token=any-token&classId=class-for-pochita-as-teacher&page=unexistant-page');
  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/integration/class-for-pochita-as-teacher');
  });
});

test('teams route to info', function(assert) {
  visit('/integration/teams?token=any-token&classId=class-for-pochita-as-teacher&page=info');
  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/info');
  });
});

/* TODO This test is broken because we commented code in integration.js. We need to find a different approach for this.
test('teams route to data analytics page in a teacher class', function(assert) {
  visit('/integration/teams?token=any-token&classId=class-for-pochita-as-teacher&page=data');
  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher');
  });
});
*/

test('teams route to data analytics page in a student class', function(assert) {
  visit('/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=data');

  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/class/class-for-pochita-as-student/analytics/performance/student');
  });
});

test('teams route to overview', function(assert) {
  visit('/integration/teams?token=any-token&classId=class-for-pochita-as-student&page=course-map');

  andThen(function() {
    assert.expect(1);
    assert.equal(currentURL(), '/class/class-for-pochita-as-student/overview?location=first-unit-id%2Bfirst-lesson-id%2Bfirst-assessment-id');
  });
});
