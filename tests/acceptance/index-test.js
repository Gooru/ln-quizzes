import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import T from 'quizzes/tests/helpers/assert';

moduleForAcceptance('Acceptance | index');

test('load: Layout', function(assert) {
  visit('/');

  andThen(function() {
    assert.expect(2);

    assert.equal(currentURL(), '/');

    //hero
    var $landingPage = find('.controller.index');
    T.exists(assert, $landingPage, "Missing landing page");
  });
});
