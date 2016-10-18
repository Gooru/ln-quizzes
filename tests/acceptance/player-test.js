/*import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import T from 'quizzes/tests/helpers/assert';

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
});*/
/* TODO review when player is working
test('Layout - default to collection since parameter is not sent', function (assert) {
  assert.expect(5);
  visit('/player/all-resource-types-collection-id');

  andThen(function () {
    assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=image-resource-id');

    const $playerContainer = find(".controller.player");
    T.exists(assert, $playerContainer, "Missing player");
    T.exists(assert, $playerContainer.find(".main .gru-navigation"), "Missing player navigation");
    T.exists(assert, $playerContainer.find(".main .gru-viewer"), "Missing player viewer");
    T.exists(assert, $playerContainer.find(".aside .gru-navigator"), "Missing player navigator");
  });
});


test('Collection - Navigate to all resources types', function (assert) {
  assert.expect(12);
  visit('/player/all-resource-types-collection-id?type=collection'); //visit all resource types collection

  andThen(function () {
    const $playerContainer = find(".controller.player");

    //last visited resource is displayed
    assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=image-resource-id&type=collection');
    T.exists(assert, $playerContainer.find('.gru-viewer .gru-image-resource'), "Missing image resource component");

    click($playerContainer.find(".gru-navigator .list-group-item:eq(1)")); // navigating to url resource, website
    andThen(function () {
      assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=webpage-resource-id&type=collection');
      T.exists(assert, $playerContainer.find('.gru-viewer .gru-url-resource'), "Missing url resource component");

      click($playerContainer.find(".gru-navigator .list-group-item:eq(2)")); // navigating to youtube resource, video
      andThen(function () {
        assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=video-resource-id&type=collection');
        T.exists(assert, $playerContainer.find('.gru-viewer .gru-youtube-resource'), "Missing youtube resource component");
        click($playerContainer.find(".gru-navigator .list-group-item:eq(3)")); // navigating to url resource, interactive
        andThen(function () {
          assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=interactive-resource-id&type=collection');
          T.exists(assert, $playerContainer.find('.gru-viewer .gru-url-resource'), "Missing url resource component");
          click($playerContainer.find(".gru-navigator .list-group-item:eq(4)")); // navigating to url resource, audio
          andThen(function () {
            assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=audio-resource-id&type=collection');
            T.exists(assert, $playerContainer.find('.gru-viewer .gru-url-resource'), "Missing url resource component");

            click($playerContainer.find(".gru-navigator .list-group-item:eq(5)")); // navigating to youtube resource
            andThen(function () {
              assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=text-resource-id&type=collection');
              T.exists(assert, $playerContainer.find('.gru-viewer .gru-pdf-resource'), "Missing pdf resource component");
            });
          });
        });
      });
    });
  });
});
test('Collection - Open collection without passing the type', function (assert) {
  assert.expect(2);
  visit('/player/all-resource-types-collection-id'); //visit all resource types collection
  andThen(function () {
    const $playerContainer = find(".controller.player");

    //last visited resource is displayed
    assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=image-resource-id');
    T.exists(assert, $playerContainer.find('.gru-viewer .gru-image-resource'), "Missing image resource component");
  });
});


test('Assessment - Navigate to all question types', function (assert) {
  assert.expect(16);
  visit('/player/all-question-types-assessment-id?type=assessment'); //visit all question types collection

  andThen(function () {
    const $playerContainer = find(".controller.player");

    //checking that the last visited resource is displayed
    assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=multiple-choice-question-id&type=assessment');
    T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-multiple-choice'), "Missing multiple choice component");

    click($playerContainer.find(".gru-navigator .list-group-item:eq(1)")); // navigating to multiple answer question
    andThen(function () {
      assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=dc66d543-12a1-11e6-aba0-0935596035e8&type=assessment');
      T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-multiple-answer'), "Missing multiple answer component");

      click($playerContainer.find(".gru-navigator .list-group-item:eq(2)")); // navigating to true/false question
      andThen(function () {
        assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=fd01639f-12a1-11e6-aba0-0935596035e8&type=assessment');
        T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-true-false'), "Missing true/false component");

        click($playerContainer.find(".gru-navigator .list-group-item:eq(3)")); // navigating to fib question
        andThen(function () {
          assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=f77ede06-12a1-11e6-aba0-0935596035e8&type=assessment');
          T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-fib'), "Missing fib component");

          click($playerContainer.find(".gru-navigator .list-group-item:eq(4)")); // navigating to reorder question
          andThen(function () {
            assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=f0d555af-1390-11e6-bd2c-c13107c2c772&type=assessment');
            T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-reorder'), "Missing reorder component");

            click($playerContainer.find(".gru-navigator .list-group-item:eq(5)")); // navigating to hot text highlight question
            andThen(function () {
              assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=f0457189-1390-11e6-bd2c-c13107c2c772&type=assessment');
              T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-hot-text-highlight'), "Missing hot text highlight component");

              click($playerContainer.find(".gru-navigator .list-group-item:eq(6)")); // navigating to hot spot image question
              andThen(function () {
                assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=f06f40ba-1390-11e6-bd2c-c13107c2c772&type=assessment');
                T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-hs-image'), "Missing hot spot image component");

                click($playerContainer.find(".gru-navigator .list-group-item:eq(7)")); // navigating to hot spot text question
                andThen(function () {
                  assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=efbf5176-1390-11e6-bd2c-c13107c2c772&type=assessment');
                  T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-hs-text'), "Missing hot spot text component");
                });
              });
            });
          });
        });
      });
    });
  });
});



test('Assessment - Open assessment without passing the type', function (assert) {
  assert.expect(2);
  visit('/player/all-question-types-assessment-id'); //visit all question types collection

  andThen(function () {
    const $playerContainer = find(".controller.player");

    //checking that the last visited resource is displayed
    assert.equal(currentURL(), '/player/all-question-types-assessment-id?resourceId=multiple-choice-question-id');
    T.exists(assert, $playerContainer.find('.gru-question-viewer .gru-multiple-choice'), "Missing multiple choice component");
  });
});

test('closePlayer: If navigating directly to the player, closing the player should return the user to the home page', function(assert) {
  visit('/player/all-resource-types-collection-id');
  andThen(function() {

    const playerCloseButton = $('.gru-navigator .navigator-header div:first-child');
    assert.equal(currentRouteName(), 'player', 'Incorrect route name');
    click(playerCloseButton);
    andThen(function() {

      assert.equal(currentURL(), '/', 'Redirected to an incorrect url');
    });
  });
});


test('closePlayer: Return to search after closing the player', function(assert) {
  visit('/search/collections?term=water');
  andThen(function() {

    const collectionCardLink = find(".results div:eq(0) .collection-info a");
    click(collectionCardLink);
    andThen(function() {

      const secondResource = $('.list-group-item').eq(1);
      assert.equal(currentRouteName(), 'player', 'Incorrect route name');
      click(secondResource);
      andThen(function() {

        // Second resource (with iframe) should have been selected
        const playerCloseButton = $('.gru-navigator .navigator-header div:first-child');
        click(playerCloseButton);
        andThen(function() {

          const url = currentURL();
          assert.equal('/search/collections?term=water', url, 'Redirected to an incorrect url');
        });
      });
    });
  });
});


test('Collection - see usage report', function (assert) {
  assert.expect(7);
  visit('/player/all-resource-types-collection-id');
  andThen(function () {
    assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=image-resource-id', 'Wrong landing url');
    const $playerContainer = find(".controller.player");
    T.exists(assert, $playerContainer, "Missing player");

    var $navigation = $playerContainer.find(".gru-navigator");
    click($navigation.find(".see-usage-report"));
    andThen(function () {
      assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=image-resource-id', 'When anonymous should remain in the same page');
      T.notExists(assert, $playerContainer.find(".gru-navigation"), "Navigation should not be visible");
      T.notExists(assert, $playerContainer.find(".gru-navigator"), "Navigator should not be visible");
      T.exists(assert, $playerContainer.find(".gru-assessment-report"), "Navigation assessment report should be visible");
      T.exists(assert, $playerContainer.find(".report-navigation .back"), "Missing back button");
    });
  });
});

test('selectNavigatorItem: When moving to another resource', function (assert) {
  assert.expect(2);
  visit('/player/all-resource-types-collection-id');
  andThen(function () {
    const $playerContainer = find(".controller.player");
    T.exists(assert, $playerContainer, "Missing player");
    click($playerContainer.find(".gru-navigator .list-group-item:eq(3)"));
    andThen(function () {
      //it navigates to specific resource
      assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=interactive-resource-id');
    });
  });
});

test('selectNavigatorItem & closeNavigator: When moving to another resource the navigator should be closed', function (assert) {
  assert.expect(7);
  visit('/player/all-resource-types-collection-id');
  andThen(function () {
    const $playerContainer = find(".controller.player");
    const $appContainer = find(".app-container");

    T.exists(assert, $playerContainer, "Missing player");
    T.exists(assert, $appContainer, "Missing app container");

    assert.ok(!$appContainer.hasClass("navigator-on"), "Shouldn't have navigator-on class");
    T.exists(assert, $playerContainer.find(".gru-navigation .navigation-bar span"), "Missing navigation hamburger icon");

    click($playerContainer.find(".gru-navigation .navigation-bar span"));

    andThen(function () {
      assert.ok($appContainer.hasClass("navigator-on"), "Should have navigator-on class");
      click($playerContainer.find(".gru-navigator .list-group-item:eq(3)"));
      andThen(function () {
        //it navigates to specific resource
        assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=interactive-resource-id');
        andThen(function () {
          assert.ok(!$appContainer.hasClass("navigator-on"), "Shouldn't have navigator-on class");
        });
      });
    });
  });
});

test('openNavigator & closeNavigator: When opening and closing the navigator', function (assert) {
  assert.expect(6);
  visit('/player/all-resource-types-collection-id');
  andThen(function () {
    const $appContainer = find(".app-container"),
      $playerContainer = find(".controller.player");
    T.exists(assert, $appContainer, "Missing app container");
    assert.ok(!$appContainer.hasClass("navigation-on"), "Shouldn't have navigator-on class");
    T.exists(assert, $playerContainer, "Missing player");

    //open navigator
    T.exists(assert, $playerContainer.find(".gru-navigation .navigation-bar span"), "Missing navigation hamburger icon");
    click($playerContainer.find(".gru-navigation .navigation-bar span"));
    andThen(function () {
      assert.ok($appContainer.hasClass("navigator-on"), "Should have navigator-on class");

      //close navigator
      click($playerContainer.find(".gru-navigator .hamburger-icon"));
      andThen(function () {
        assert.ok(!$appContainer.hasClass("navigator-on"), "Shouldn't have navigator-on class");
      });
    });
  });
});
*/
