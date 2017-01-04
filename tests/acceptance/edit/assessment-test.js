import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | edit/assessment',{
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

test('visiting /edit/assessment', function(assert) {
  visit('/edit/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
  });
});
