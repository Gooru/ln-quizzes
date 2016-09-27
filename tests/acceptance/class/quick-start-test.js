import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/quick-start', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-info-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Student Layout', function(assert) {
  visit('/class/class-for-pochita-as-student/quick-start');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-student/quick-start');

    const $quickStartContainer = find(".controller.class .controller.quick-start");
    T.exists(assert, $quickStartContainer, "Missing quick-start container");

    const $newCourseContainer = find(".new-course-container");
    T.exists(assert, $newCourseContainer.find(".lead"), "Missing header for new course");
    T.exists(assert, $newCourseContainer.find(".description"), "Missing description for new course");

    T.exists(assert, $newCourseContainer.find(".actions button.new-collection"), "Missing new collection button for new course");
    T.exists(assert, $newCourseContainer.find(".actions button.new-assessment"), "Missing new assessment button for new course");
    T.exists(assert, $newCourseContainer.find(".actions button.remix"), "Missing remix button for new course");


    const $existingCourseContainer = find(".existing-course-container");
    T.exists(assert, $existingCourseContainer.find(".lead"), "Missing header for existing course");
    T.exists(assert, $existingCourseContainer.find(".description"), "Missing description for existing course");

    T.exists(assert, $existingCourseContainer.find(".actions button.choose-course"), "Missing new collection button for existing course");

    const $remixCourseContainer = find(".remix-course-container");
    T.exists(assert, $remixCourseContainer.find(".lead"), "Missing header for remix course");
    T.exists(assert, $remixCourseContainer.find(".description"), "Missing description for remix course");

    T.exists(assert, $remixCourseContainer.find(".actions button.remix"), "Missing new collection button for remix course");

  });
});
