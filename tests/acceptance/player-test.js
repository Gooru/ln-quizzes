import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import T from 'dummy/tests/helpers/assert';

moduleForAcceptance('Acceptance | player');

test('Layout', function(assert) {
  assert.expect(5);
  visit('/player/context-simple-id');

  andThen(function() {
    assert.equal(currentURL(), '/player/context-simple-id');
    const $continue = find('.qz-player-confirmation button.continue');
    click($continue);
    andThen(function() {
      const $playerContainer = find('.component.player');
      T.exists(assert, $playerContainer, 'Missing player');
      T.exists(
        assert,
        $playerContainer.find('.qz-main .qz-navigation'),
        'Missing player navigation'
      );
      T.exists(
        assert,
        $playerContainer.find('.qz-main .qz-viewer'),
        'Missing player viewer'
      );
      T.exists(
        assert,
        $playerContainer.find('.qz-aside .qz-navigator'),
        'Missing player navigator'
      );
    });
  });
});
