import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent('player/questions/qz-hot-text-highlight', 'Unit | Component | player/questions/qz hot text hightlight', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('notifyEvents on load', function(assert) {
  assert.expect(2);
  let expectedAnswerId = [{ value: 'selected,9' }];
  let component = this.subject({
    notifyAnswerChanged: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer changed'),
    notifyAnswerLoaded: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer loaded'),
    notifyAnswerCompleted: () => assert.ok(false, 'Answer completed should not be called'),
    notifyAnswerCleared: () => assert.ok(false, 'Answer cleared should not be called')
  });
  component.notifyEvents(Ember.A([
    Ember.Object.create({ index: 9, text: 'selected' })
  ]), true);
});

test('notifyEvents not on load', function(assert) {
  assert.expect(2);
  let expectedAnswerId = [{ value: 'selected,9' }];
  let component = this.subject({
    notifyAnswerChanged: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer changed'),
    notifyAnswerLoaded: () => assert.ok(false, 'Answer loaded should not be called'),
    notifyAnswerCompleted: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer completed'),
    notifyAnswerCleared: () => assert.ok(false, 'Answer cleared should not be called')
  });
  component.notifyEvents(Ember.A([
    Ember.Object.create({ index: 9, text: 'selected' })
  ]), false);
});

test('markItem select item', function(assert) {
  assert.expect(2);
  let expectedAnswerId = [{ value: 'selected-2,0'}, { value: 'selected,9' }];
  let itemToSelect = Ember.Object.create({ index: 9, text: 'selected', selected: false });
  let component = this.subject({
    items: [
      Ember.Object.create({ index: 0, text: 'selected-2', selected: true }),
      itemToSelect,
      Ember.Object.create({ index: 18, text: 'not-selected', selected: false })
    ],
    readOnly: false,
    notifyAnswerChanged: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer changed'),
    notifyAnswerLoaded: () => assert.ok(false, 'Answer loaded should not be called'),
    notifyAnswerCompleted: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer completed'),
    notifyAnswerCleared: () => assert.ok(false, 'Answer cleared should not be called')
  });
  component.send('markItem', itemToSelect);
});

test('markItem clear', function(assert) {
  assert.expect(2);
  let expectedAnswerId = [];
  let itemToSelect = Ember.Object.create({ index: 9, text: 'selected', selected: true });
  let component = this.subject({
    items: [
      Ember.Object.create({ index: 0, text: 'selected-2', selected: false }),
      itemToSelect,
      Ember.Object.create({ index: 18, text: 'not-selected', selected: false })
    ],
    readOnly: false,
    notifyAnswerChanged: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer changed'),
    notifyAnswerLoaded: () => assert.ok(false, 'Answer loaded should not be called'),
    notifyAnswerCompleted: () => assert.ok(false, 'Answer completed should not be called'),
    notifyAnswerCleared: answerId => assert.deepEqual(answerId, expectedAnswerId, 'Answer should match in answer cleared')
  });
  component.send('markItem', itemToSelect);
});

test('getSelectedItems', function(assert) {
  assert.expect(3);
  let component = this.subject({
    items: [
      Ember.Object.create({ index: 0, text: 'not-selected', selected: false }),
      Ember.Object.create({ index: 9, text: 'selected', selected: true }),
      Ember.Object.create({ index: 18, text: 'not-selected-2', selected: false })
    ]
  });
  let selectedItems = component.getSelectedItems();
  assert.equal(selectedItems.length, 1, 'Wrong selected items length');
  assert.equal(selectedItems[0].get('index'), 9, 'Wrong first item index');
  assert.equal(selectedItems[0].get('text'), 'selected', 'Wrong first item text');
});

test('items', function(assert) {
  assert.expect(1);
  let mapItems = ({ index, text, selected }) => ({ index, text, selected });
  let component = this.subject({
    question: ResourceModel.create({
      body: 'not-selected selected not-selected-2',
      isHotTextHighlightWord: true
    }),
    userAnswer: [{
      value: 'selected,13'
    }]
  });
  let expectedItems = [
    { index: 0, text: 'not-selected', selected: false },
    { index: 13, text: 'selected', selected: true },
    { index: 22, text: 'not-selected-2', selected: false }
  ];
  assert.deepEqual(component.get('items').map(mapItems), expectedItems, 'Wrong values for items');
});
