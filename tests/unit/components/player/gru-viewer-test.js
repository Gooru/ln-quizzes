import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('player/gru-viewer', 'Unit | Component | player/gru viewer', {
  integration: false
});

test('resourceComponentSelected for non valid resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      type: 'any-non-valid-value'
    })
  });

  assert.ok(!component.get('resourceComponentSelected'), 'It should return false|undefined');
});

test('resourceComponentSelected for image resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      isImageResource: true
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.gru-image-resource', 'Wrong component name');
});

test('resourceComponentSelected for text/pdf resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      type: 'handouts'
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.gru-pdf-resource', 'Wrong component name');
});

test('resourceComponentSelected for youtube resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      type: 'video/youtube'
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.gru-youtube-resource', 'Wrong component name');
});
test('resourceComponentSelected for vimeo resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      type: 'vimeo/video'
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.gru-vimeo-resource', 'Wrong component name');
});

test('resourceComponentSelected for youtube resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      type: 'resource/url'
    })
  });

  assert.equal(component.get('resourceComponentSelected'), 'player.resources.gru-url-resource', 'Wrong component name');
});

test('buttonTextKey when is not the last resource', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: 'resource/url'
    }),
    collection: Ember.Object.create({
      isLastResource: function () { return false; }
    })
  });

  assert.equal(component.get('buttonTextKey'), 'common.save-next', 'Wrong button text key');
});

test('buttonTextKey when is the last resource and assessment', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: 'resource/url'
    }),
    collection: Ember.Object.create({
      isLastResource: function () { return true; },
      isAssessment: true
    })
  });

  assert.equal(component.get('buttonTextKey'), 'common.save-submit', 'Wrong button text key');
});

test('buttonTextKey when is the last resource and collection', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: 'resource/url'
    }),
    collection: Ember.Object.create({
      isLastResource: function () { return true; },
      isAssessment: false
    })
  });

  assert.equal(component.get('buttonTextKey'), 'common.save-finish', 'Wrong button text key');
});
