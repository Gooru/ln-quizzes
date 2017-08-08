import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Category from 'quizzes-addon/models/rubric/rubric-category';

moduleFor('model:rubric/rubric', 'Unit | Model | rubric/rubric', {
  unit: true
});

test('hasAudience False', function(assert) {
  var model = this.subject({
    audience: Ember.A([])
  });

  assert.notOk(model.get('hasAudience'), 'Should not have audience');
});

test('hasAudience true', function(assert) {
  var model = this.subject({
    audience: Ember.A(['audience'])
  });

  assert.ok(model.get('hasAudience'), 'Should have audience');
});

test('hasCategories False', function(assert) {
  var model = this.subject({
    categories: Ember.A([])
  });

  assert.notOk(model.get('hasCategories'), 'Should not have categories');
});

test('hasCategories True', function(assert) {
  var model = this.subject({
    categories: Ember.A([Category.create({ id: 'categoryId' })])
  });
  assert.ok(model.get('hasCategories'), 'Should have categories');
});
