import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import T from 'quizzes/tests/helpers/assert';

moduleForAcceptance('Acceptance | class', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-token',
      user: {
        gooruUId: 'class-token-user-id'
      }
    });
  }
});

test('Layout', function(assert) {
  visit('/class/class-10'); //@todo create stubs

  andThen(function() {
    assert.equal(currentURL(), '/class/class-10');

    const $classContainer = find(".controller.class");
    T.exists(assert, $classContainer, "Missing class container");
    T.exists(assert, $classContainer.find(".navigation"), "Missing class navigation");
    T.exists(assert, $classContainer.find(".content"), "Missing class content");
  });
});

test('When info page is selected', function(assert) {
  visit('/class/class-10');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-10');

    const $overviewMenuItem = find(".navigation .class-menu .info");

    click($overviewMenuItem);

    andThen(function() {
      assert.equal(currentURL(), '/class/class-10/info');

    });
   });
});

test('When overview page is selected', function(assert) {

  // TODO Remove this assert and enable the commented code once integration is complete
  assert.ok(true, 'This is a temporal assert!!');

  /*
  visit('/class/class-10');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-10');

    const $overviewMenuItem = find(".navigation .class-menu .overview");

    click($overviewMenuItem);

    andThen(function() {
      assert.equal(currentURL(), '/class/class-10/overview?location=second-unit-id%2B27f0bc24-c2b5-40d8-bb8f-e6ec939ad553%2B567399f336d4a8e75eb10661');

    });
  });
  */
});
