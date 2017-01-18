import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('editor/assessment/qz-submission-format', 'Unit | Component | editor/assessment/qz submission format', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('selectType', function(assert) {
  let component = this.subject();
  component.send('selectType','upload');
  assert.equal(component.get('selectedType'),'upload','Upload should be the option selected');
});
