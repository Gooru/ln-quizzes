import { moduleForComponent, test } from 'ember-qunit';
import T from 'quizzes/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('gru-question-options', 'Integration | Component | question options', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set('locale','en');
  }
});

test('gru-question-options-default', function(assert) {

  const selectedOptionType = Ember.A(['single-choice']);

  this.set('selectedOptionType', selectedOptionType);

  this.render(hbs`{{search/gru-question-options selectedOptionType=selectedOptionType}}`); //render the component
  var $component = this.$(); //component dom element

  assert.expect(24); //making sure all asserts are called

  const $menuOptions =$component.find('.options');
  const $singleChoiceButton =$menuOptions.find('.single-choice');
  T.exists(assert, $singleChoiceButton, 'Missing single choice button');
  T.exists(assert, $singleChoiceButton.find('.icon'), 'Missing icon single choice button');
  assert.equal(T.text($singleChoiceButton.find('.text')), 'Single Choice', 'Incorrect single choice button text');

  const $multipleAnswerButton =$menuOptions.find('.multiple-answer');
  T.exists(assert, $multipleAnswerButton, 'Missing multiple answer button');
  T.exists(assert, $multipleAnswerButton.find('.icon'), 'Missing icon multiple answer button');
  assert.equal(T.text($multipleAnswerButton.find('.text')), 'Multiple Answer', 'Incorrect multiple answer button text');

  const $trueFalseButton =$component.find('.true-false');
  T.exists(assert, $trueFalseButton, 'Missing true-false button');
  T.exists(assert, $trueFalseButton.find('.icon'), 'Missing icon true-false button');
  assert.equal(T.text($trueFalseButton.find('.text')), 'True / False', 'Incorrect true-false button text');

  const $fibButton =$component.find('.fib');
  T.exists(assert, $fibButton, 'Missing fib button');
  T.exists(assert, $fibButton.find('.icon'), 'Missing icon fib button');
  assert.equal(T.text($fibButton.find('.text')), 'Fill in the Blank', 'Incorrect fib button text');

  const $htReorderButton =$component.find('.ht-reorder');
  T.exists(assert, $htReorderButton, 'Missing ht-reorder button');
  T.exists(assert, $htReorderButton.find('.icon'), 'Missing icon ht-reorder button');
  assert.equal(T.text($htReorderButton.find('.text')), 'Drag and Drop Order', 'Incorrect ht-reorder button text');

  const $htHighlightButton =$component.find('.ht-highlight');
  T.exists(assert, $htHighlightButton, 'Missing ht-highlight button');
  T.exists(assert, $htHighlightButton.find('.icon'), 'Missing icon ht-highlight button');
  assert.equal(T.text($htHighlightButton.find('.text')), 'Hot Text- Highlight', 'Incorrect ht-highlight button text');

  const $hsTextButton =$component.find('.hs-text');
  T.exists(assert, $hsTextButton, 'Missing hs-text button');
  T.exists(assert, $hsTextButton.find('.icon'), 'Missing icon hs-text button');
  assert.equal(T.text($hsTextButton.find('.text')), 'Multiple Select - Text', 'Incorrect hs-text button text');

  const $hsImagestButton =$component.find('.hs-images');
  T.exists(assert, $hsImagestButton, 'Missing hs-images button');
  T.exists(assert, $hsImagestButton.find('.icon'), 'Missing icon hs-images button');
  assert.equal(T.text($hsImagestButton.find('.text')), 'Multiple Select - Image', 'Incorrect hs-images button text');

});

test('search-filter-onSingleChoiceClick', function(assert) {
  assert.expect(1); //making sure all asserts are called

  this.on('selectMenuOption', function(options) {
    assert.equal(options[0], 'single-choice', 'Incorrect single-choice option type');
  });

  this.render(hbs`{{search/gru-question-options onSelectMenuOption='selectMenuOption'}}`);

  var $component = this.$(); //component dom element

  const $singleChoiceOptionButton = $component.find('.single-choice.btn-option');

  $singleChoiceOptionButton.click();
  assert.ok(!$singleChoiceOptionButton.hasClass('selected'), 'Missing single choice option selected');
});
