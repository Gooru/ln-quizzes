import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import T from 'quizzes/tests/helpers/assert';

moduleForAcceptance('Acceptance | profile content courses', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'course-content-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/id-for-pochita/content/courses');

  andThen(function() {
    assert.equal(currentURL(), '/id-for-pochita/content/courses');

    const $contentCourseContainer = find(".controller.profile-courses");
    T.exists(assert, $contentCourseContainer, "Missing content courses container");
    T.exists(assert, $contentCourseContainer.find(".course-content >div.gru-course-card:first-child"), "Missing first course card");
    assert.equal(T.text($contentCourseContainer.find(".course-content >div:first-child .card-header .course-title")), "Test Course", "Incorrect course card title text");
  });
});
