import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | Content Classes Join Class', {
  beforeEach: function () {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'profile-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function (assert) {
  visit('/content/classes/join');

  andThen(function () {
    assert.equal(currentURL(), '/content/classes/join');

    let $container = find(".controller.join-class");
    assert.ok($container.length, "Container is missing");
  });
});

// TODO JBP Fix this!!
/*
test('Join class', function (assert) {
  visit('/content/classes/join');

  andThen(function () {
    assert.equal(currentURL(), '/content/classes/join');

    let $container = find(".controller.join-class");
    $container.find(".gru-input.code input").val("any-code");
    $container.find(".gru-input.code input").blur();

    click($container.find("a.join-class-btn"));
    andThen(function(){
      assert.equal(currentRouteName(), 'class.overview');
    });

  });
});
*/
