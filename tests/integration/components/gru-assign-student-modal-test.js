import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assign-student-modal', 'Integration | Component | gru assign student modal', {
  integration: true
});

test('it renders', function(assert) {
 let model={
   students:[
    {id:'student-1',
      firstName:'student-1',
      lastName:'student-1',
      username:'student-1'},
    {id:'student-2',
      firstName:'student-2',
      lastName:'student-2',
      username:'student-2'},
    {id:'student-3',
      firstName:'student-3',
      lastName:'student-3',
      username:'student-3'}]
};

  this.set('model',model);
  this.render(hbs`{{gru-assign-student-modal model=model}}`);
  var $studentModalComponent = this.$();
  assert.ok($studentModalComponent.find('.gru-assign-student-modal').length, 'Missing modal component');
  assert.ok($studentModalComponent.find('.gru-assign-student-modal h4.modal-title').length, 'Missing modal title');
  assert.ok($studentModalComponent.find('.qz-assign-students').length, 'Missing assign students');
});
