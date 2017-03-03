import { moduleForComponent, test } from 'ember-qunit';
import Collection from 'quizzes-addon/models/collection/collection';
moduleForComponent('player/qz-player-confirmation', 'Unit | Component | player/qz player confirmation', {
  unit: true
});

test('attemptsLeft', function(assert) {
  assert.expect(1);
  let collection = Collection.create({
    title: 'Assessment Title',
    settings:{
      attempts: 3
    }
  });
  let attempts = 2;

  let component = this.subject({
    collection,
    attempts
  });

  assert.equal(component.get('attemptsLeft'), 1, 'Incorrect attempts left');
});

test('unlimited', function(assert) {
  assert.expect(2);
  let collection = Collection.create({
    title: 'Assessment Title',
    settings:{
      attempts: -1
    }
  });
  let component = this.subject({
    collection
  });

  assert.equal(component.get('unlimited'), true, 'Should be unlimited');

  let collection2 = Collection.create({
    title: 'Assessment Title',
    settings:{
      attempts: 2
    }
  });

  component.set('collection',collection2);

  assert.equal(component.get('unlimited'), false, 'Should not be unlimited');
});

test('noMoreAttempts', function(assert) {
  assert.expect(1);
  let collection = Collection.create({
    title: 'Assessment Title',
    settings:{
      attempts: 2
    }
  });
  let attempts = 2;

  let component = this.subject({
    collection,
    attempts
  });

  assert.equal(component.get('noMoreAttempts'), true, 'Should not have more attempts');
});

test('disableStart', function(assert) {
  assert.expect(1);
  let collection = Collection.create({
    title: 'Assessment Title',
    settings:{
      attempts: 2
    }
  });
  let attempts = 2;

  let component = this.subject({
    collection,
    attempts
  });

  assert.equal(component.get('disableStart'), true, 'Start should be disabled');
});
