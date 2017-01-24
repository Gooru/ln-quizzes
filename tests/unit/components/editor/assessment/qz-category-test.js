import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('editor/assessment/qz-category', 'Unit | Component | editor/assessment/qz category', {
  unit: true
});

test('setFeedBack', function(assert) {
  let component = this.subject();
  assert.equal(component.get('category.requiredFeedback'),false,'Feedback is not required');
  component.send('setFeedBack');
  assert.equal(component.get('category.requiredFeedback'),true,'Feedback is not required');
});

test('onScoringChange', function(assert) {
  let component = this.subject();
  assert.equal(component.get('showScore'),false,'Should not show score');
  component.send('onScoringChange',true);
  assert.equal(component.get('showScore'),true,'Should show the score');
});

test('Delete Category', function(assert) {
  let component = this.subject();
  let categoryDelete = {id:'category-test'};
  component.set('sendAction', function(actionName, category) {
    assert.equal(actionName, 'onDeleteCategory', 'Action sent should match');
    assert.equal(category,categoryDelete, 'Category should match');
  });
  component.send('deleteCategory', categoryDelete);
});
