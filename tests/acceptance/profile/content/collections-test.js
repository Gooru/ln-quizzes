import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import T from 'quizzes/tests/helpers/assert';

moduleForAcceptance('Acceptance | profile content collections', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'collections-content-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita/content/collections');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/collections');

    const $contentCourseContainer = find(".controller.content-collections");
    T.exists(assert, $contentCourseContainer, "Missing content collections container");

    const cards = $contentCourseContainer.find(".collections .card");
    assert.equal(cards.length, 5, "Missing cards");

  });
});
