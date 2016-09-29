import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import ClassModel from 'quizzes/models/content/class';

moduleForComponent('gru-input-number', 'Integration | Component | gru input number', {
  integration: true
});

test('number input invalid', function(assert) {
  assert.expect(5); // making sure all asserts are called

  this.set('model', ClassModel.create(Ember.getOwner(this).ownerInjection(), {
    minScore: null
  }));
  this.render(hbs`{{validation.gru-input-number model=model valuePath='minScore' min=1 max=100 step=1}}`); // render the component
  var $component = this.$(); // component dom element
  var $input = $component.find("input[type=number]");

  T.exists(assert, $input, "Input number element not found");
  assert.equal($input.val(), "", "Wrong value");

  $input.val('1.1');
  $input.blur();

  return wait().then(function () {
    assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');

    $input.val('10');
    $input.blur();
    return wait().then(function () {
      assert.ok(!$component.find(".error-messages .error").length, 'Input error message was not hidden');

      $input.val('11e20');
      $input.blur();

      return wait().then(function () {
        assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');
      });
    });
  });
});

test('number input range', function(assert) {
  assert.expect(7); // making sure all asserts are called

  this.set('model', ClassModel.create(Ember.getOwner(this).ownerInjection(), {
    minScore: null
  }));
  this.render(hbs`{{validation.gru-input-number model=model valuePath='minScore' min=1 max=100 step=1}}`); // render the component
  var $component = this.$(); // component dom element
  var $input = $component.find("input[type=number]");

  T.exists(assert, $input, "Input number element not found");
  assert.equal($input.val(), "", "Wrong value");
  $input.blur();

  return wait().then(function () {
    assert.ok(!$component.find(".error-messages .error").length, 'Input error message was not hidden');

    $input.val('101');
    $input.blur();
    return wait().then(function () {
      assert.ok($component.find(".error-messages .error").length, 'Input error message was hidden');

      $input.val('1');
      $input.blur();

      return wait().then(function () {
        assert.ok(!$component.find(".error-messages .error").length, 'Input error message was not hidden');

        $input.val('-1');
        $input.blur();

        return wait().then(function () {
          assert.ok($component.find(".error-messages .error").length, 'Title error message was hidden');
          $input.val('50');
          $input.blur();

          return wait().then(function () {
            assert.ok(!$component.find(".error-messages .error").length, 'Input error message was not hidden');
          });
        });
      });
    });
  });
});
