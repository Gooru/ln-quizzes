import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('editor/assessment/qz-assessment', 'Unit | Component | editor/assessment/qz assessment', {
  unit: true
});

test('addNewCategory', function(assert) {
  let component = this.subject();
  assert.equal(component.get('categories.length'), 1, 'Should have one category');
  component.send('addNewCategory');
  assert.equal(component.get('categories.length'), 2, 'Should have 2 categories');
});

test('setFeedBack', function(assert) {
  let component = this.subject();
  assert.equal(component.get('assessment.requiredFeedback'),false,'Feedback is not required');
  component.send('setFeedBack');
  assert.equal(component.get('assessment.requiredFeedback'),true,'Feedback is not required');
});
