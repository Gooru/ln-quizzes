import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import SearchModel from 'gooru-web/models/search/content-search';

moduleForComponent('gru-input', 'Integration | Component | gru input', {
  integration: true
});

test('Layout and clear functionality', function(assert) {
  assert.expect(6); // making sure all asserts are called

  this.set('model', SearchModel.create(Ember.getOwner(this).ownerInjection(), {
    term: ''
  }));
  this.render(hbs`{{validation.gru-input model=model valuePath='term' hasClearButton=true}}`); // render the component
  var $component = this.$(); // component dom element
  var $input = $component.find("input[type=text]");

  T.exists(assert, $input, "Input element not found");
  assert.equal($input.val(), "", "Wrong value");

  $input.val('So');
  $input.blur();

  return wait().then(function () {
    assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');

    $input.val('Sol');
    $input.blur();
    return wait().then(function () {
      assert.ok(!$component.find(".error-messages .error").length, 'Input error message was not hidden');

      $input.val('So');
      $input.blur();

      return wait().then(function () {
        assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');
        $component.find('.clear').click();
        assert.equal($input.val(),"", "wrong value");
      });
    });
  });
});
