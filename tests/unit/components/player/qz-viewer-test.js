import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes/models/resource/resource';
import QuestionResult from 'quizzes/models/result/question';
import {QUIZZES_RESOURCE_TYPES} from 'quizzes/config/config';

moduleForComponent('player/qz-viewer', 'Unit | Component | player/qz viewer', {
  unit: true
});

test('resourceComponentSelected for non valid resource type', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      resourceType: 'any-non-valid-value'
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

test('buttonTextKey when is not the last resource', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: QUIZZES_RESOURCE_TYPES.url
    }),
    collection: Ember.Object.create({
      isLastResource: () => false
    })
  });

  assert.equal(component.get('buttonTextKey'), 'common.save-next', 'Wrong button text key');
});

test('buttonTextKey when is the last resource and assessment', function (assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: QUIZZES_RESOURCE_TYPES.url
    }),
    collection: Ember.Object.create({
      isLastResource: () => true,
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
      type: QUIZZES_RESOURCE_TYPES.url
    }),
    collection: Ember.Object.create({
      isLastResource: () => true,
      isAssessment: false
    })
  });

  assert.equal(component.get('buttonTextKey'), 'common.save-finish', 'Wrong button text key');
});

test('submitQuestion', function(assert) {
  assert.expect(3);
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  component.set('sendAction', function(actionName, q, result) {
    assert.equal(actionName, 'onSubmitQuestion', 'Action sent should match');
    assert.deepEqual(q, question, 'Question should match');
    assert.deepEqual(result, questionResult, 'QuestionResult should match');
  });
  component.set('$', function() {
    return { scrollTop: () => 0 };
  });
  component.send('submitQuestion', question, questionResult);
});
