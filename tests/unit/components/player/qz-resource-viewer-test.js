import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import { QUIZZES_RESOURCE_TYPES } from 'quizzes-addon/config/quizzes-config';

moduleForComponent('player/qz-resource-viewer', 'Unit | Component | player/qz resource viewer', {
  unit: true
});

test('resourceComponentSelected for non valid resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      resourceType: 'any-non-valid-value'
    })
  });

  assert.notOk(component.get('resourceComponentSelected'), 'It should return false|undefined');
});

test('resourceComponentSelected for image resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      isImageResource: true
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'qz-preview-url', 'Wrong component name');
});

test('resourceComponentSelected for text/pdf resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      resourceType: QUIZZES_RESOURCE_TYPES.pdf
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'qz-preview-url', 'Wrong component name');
});

test('resourceComponentSelected for youtube resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      resourceType: QUIZZES_RESOURCE_TYPES.youtube
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.qz-youtube-resource', 'Wrong component name');
});
test('resourceComponentSelected for vimeo resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      resourceType: QUIZZES_RESOURCE_TYPES.vimeo
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.qz-vimeo-resource', 'Wrong component name');
});

test('resourceComponentSelected for url resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      resourceType: QUIZZES_RESOURCE_TYPES.url
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'qz-preview-url', 'Wrong component name');
});

test('next', function(assert) {
  let component = this.subject({ isNextDisabled: false, onNext: 'onNext' });
  component.set('sendAction', action => assert.equal(action, 'onNext', 'Action sent should match'));
  component.send('next');
  assert.ok(component.isNextDisabled, 'isNextDisabled should be updated');
});
