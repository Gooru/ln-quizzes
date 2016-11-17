import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import T from 'quizzes/tests/helpers/assert';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | player', {
  beforeEach: function () {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'player-token',
      user: {
        gooruUId: 'player-token-user-id'
      }
    });
  }
});

test('Layout', function (assert) {
  assert.expect(5);
  visit('/player/context-simple-id');

  andThen(function () {
    assert.equal(currentURL(), '/player/context-simple-id');

    const $playerContainer = find('.controller.player');
    T.exists(assert, $playerContainer, 'Missing player');
    T.exists(assert, $playerContainer.find('.main .gru-navigation'), 'Missing player navigation');
    T.exists(assert, $playerContainer.find('.main .gru-viewer'), 'Missing player viewer');
    T.exists(assert, $playerContainer.find('.aside .gru-navigator'), 'Missing player navigator');
  });
});

test('Collection - Navigate', function (assert) {
  assert.expect(3);
  visit('/player/context-simple-id');

  andThen(function () {
    const $playerContainer = find('.controller.player');

    //last visited resource is displayed
    assert.equal(currentURL(), '/player/context-simple-id');
    T.exists(assert, $playerContainer.find('.gru-viewer .gru-question-viewer .gru-true-false'), 'Missing single choice question component');

    click($playerContainer.find('.gru-navigator .list-group-item:eq(1)')); // navigating to question
    andThen(function () {
      T.exists(assert, $playerContainer.find('.gru-viewer .gru-question-viewer .gru-single-choice'), 'Missing true/false question component');
    });
  });
});

test('selectNavigatorItem & closeNavigator: When moving to another resource the navigator should be closed', function (assert) {
  assert.expect(6);
  visit('/player/context-simple-id');
  andThen(function () {
    const $playerContainer = find('.controller.player');
    const $appContainer = find('.app-container');

    T.exists(assert, $playerContainer, 'Missing player');
    T.exists(assert, $appContainer, 'Missing app container');

    assert.ok(!$appContainer.hasClass('navigator-on'), 'Shouldn\'t have navigator-on class');
    T.exists(assert, $playerContainer.find('.gru-navigation .navigation-bar span'), 'Missing navigation hamburger icon');

    click($playerContainer.find('.gru-navigation .navigation-bar span'));

    andThen(function () {
      assert.ok($appContainer.hasClass('navigator-on'), 'Should have navigator-on class');
      click($playerContainer.find('.gru-navigator .list-group-item:eq(1)'));
      andThen(function () {
        assert.ok(!$appContainer.hasClass('navigator-on'), 'Shouldn\'t have navigator-on class');
      });
    });
  });
});


test('openNavigator & closeNavigator: When opening and closing the navigator', function (assert) {
  assert.expect(6);
  visit('/player/context-simple-id');
  andThen(function () {
    const $appContainer = find('.app-container'),
      $playerContainer = find('.controller.player');
    T.exists(assert, $appContainer, 'Missing app container');
    assert.ok(!$appContainer.hasClass('navigation-on'), 'Shouldn\'t have navigator-on class');
    T.exists(assert, $playerContainer, 'Missing player');

    //open navigator
    T.exists(assert, $playerContainer.find('.gru-navigation .navigation-bar span'), 'Missing navigation hamburger icon');
    click($playerContainer.find('.gru-navigation .navigation-bar span'));
    andThen(function () {
      assert.ok($appContainer.hasClass('navigator-on'), 'Should have navigator-on class');

      //close navigator
      click($playerContainer.find('.gru-navigator .hamburger-icon'));
      andThen(function () {
        assert.ok(!$appContainer.hasClass('navigator-on'), 'Shouldn\'t have navigator-on class');
      });
    });
  });
});
