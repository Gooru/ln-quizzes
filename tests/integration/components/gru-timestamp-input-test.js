import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Context from 'quizzes/models/context/context';
import T from 'quizzes/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';


moduleForComponent('gru-timestamp-input', 'Integration | Component | gru timestamp input', {
  integration: true
});

test('Timestamp layout', function(assert) {
  assert.expect(4);

  let assignment = Context.create(Ember.getOwner(this).ownerInjection());
  this.set('assignment',assignment);

  this.render(hbs`{{gru-timestamp-input model=assignment valuePath='availableDate'}}`);
  var $timestampInput = this.$();
  assert.ok($timestampInput.find('.gru-timestamp-input .date-picker .calendar').length, 'Missing calendar icon');
  assert.ok($timestampInput.find('.gru-timestamp-input .date-picker input').length, 'Missing date picker');
  assert.ok($timestampInput.find('.gru-timestamp-input .time-picker .clock').length, 'Missing time icon');
  assert.ok($timestampInput.find('.gru-timestamp-input .time-picker input').length, 'Missing time picker');
});

test('Timestamp valuePath', function(assert) {
  assert.expect(2);

  let assignment = Context.create(Ember.getOwner(this).ownerInjection());
  this.set('assignment',assignment);

  this.render(hbs`{{gru-timestamp-input model=assignment valuePath='dueDate'}}`);
  var $timestampInputComponent = this.$();
  var $input = $timestampInputComponent.find('#date-dueDate');
  var $inputTime = $timestampInputComponent.find('#time-dueDate');

  T.exists(assert, $input, 'Due date input element not found');
  $input.val('10/21/2200');
  $input.blur();

  $inputTime.val('12:31 PM');
  $inputTime.blur();

  return wait().then(function () {
    assert.ok(assignment.get('dueDate'), 'Due date missing');
  });
});

test('Validate time', function(assert) {
  assert.expect(3);

  let assignment = Context.create(Ember.getOwner(this).ownerInjection());
  this.set('assignment',assignment);

  this.render(hbs`{{gru-timestamp-input model=assignment valuePath='dueDate'}}`);
  var $timestampInputComponent = this.$();
  var $input = $timestampInputComponent.find('#date-dueDate');
  var $inputTime = $timestampInputComponent.find('#time-dueDate');

  T.exists(assert, $input, 'Due date input element not found');
  $input.val('10/21/2200');
  $input.blur();

  $inputTime.val('');
  $inputTime.blur();

  return wait().then(function () {
    assert.ok($timestampInputComponent.find('.time-picker.has-error').length, 'Time should have error');
    assert.notOk($timestampInputComponent.find('.date-picker.has-error').length, 'Date should not have error');
  });
});

test('Validate date', function(assert) {
  assert.expect(3);

  let assignment = Context.create(Ember.getOwner(this).ownerInjection());
  this.set('assignment',assignment);

  this.render(hbs`{{gru-timestamp-input model=assignment valuePath='availableDate'}}`);
  var $timestampInputComponent = this.$();
  var $input = $timestampInputComponent.find('#date-availableDate');
  var $inputTime = $timestampInputComponent.find('#time-availableDate');

  T.exists(assert, $input, 'Available date input element not found');
  $input.val('');
  $input.blur();

  $inputTime.val('11:30 AM');
  $inputTime.blur();

  return wait().then(function () {
    assert.notOk($timestampInputComponent.find('.time-picker.has-error').length, 'Time should not have error');
    assert.ok($timestampInputComponent.find('.date-picker.has-error').length, 'Date should have error');
  });
});
