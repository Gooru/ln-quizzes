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
