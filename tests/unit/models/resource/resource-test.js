import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:resource/resource', 'Unit | Model | resource/resource', {
  unit: true
});

test('isQuestion', function(assert) {
  assert.expect(1);
  let model = this.subject({
    isResource: false
  });

  assert.ok(model.get('isQuestion'), 'It should be question');
});

test('format question', function(assert) {
  assert.expect(1);
  let model = this.subject({
    isResource: false
  });

  assert.ok(model.get('format'), 'question');
});

test('format resource', function(assert) {
  assert.expect(1);
  let model = this.subject({
    isResource: true
  });

  assert.ok(model.get('format'), 'question');
});

test('isSingleChoice', function(assert) {
  assert.expect(1);
  let model = this.subject({
    type: 'single_choice'
  });

  assert.ok(model.get('isSingleChoice'), 'It should be single choice');
});

test('isMultipleAnswer', function(assert) {
  assert.expect(1);
  let model = this.subject({
    type: 'MA'
  });

  assert.ok(model.get('isMultipleAnswer'), 'It should be multiple answer');
});

test('isTrueFalse', function(assert) {
  assert.expect(1);
  let model = this.subject({
    type: 'true_false'
  });

  assert.ok(model.get('isTrueFalse'), 'It should be true/false');
});

test('isOpenEnded', function(assert) {
  assert.expect(1);
  let model = this.subject({
    type: 'OE'
  });

  assert.ok(model.get('isOpenEnded'), 'It should be open ended');
});

test('isFIB', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'FIB'
  });

  assert.ok(model.get('isFIB'), 'It should be fill in the blank');
});

test('isHotSpotText', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'HS_TXT'
  });

  assert.ok(model.get('isHotSpotText'), 'It should be hot spot text');
});

test('isHotSpotImage', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'HS_IMG'
  });

  assert.ok(model.get('isHotSpotImage'), 'It should be hot spot image');
});

test('isHotTextReorder', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'drag_and_drop'
  });

  assert.ok(model.get('isHotTextReorder'), 'It should be hot text reorder');
});

test('isHotTextHighlight', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'HT_HL'
  });

  assert.ok(model.get('isHotTextHighlight'), 'It should be hot text high light');
});

test('isImageResource', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'image/png'
  });

  assert.ok(model.get('isImageResource'), 'It should be image resource type');
});

test('isYoutubeResource', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'video/youtube'
  });

  assert.ok(model.get('isYoutubeResource'), 'It should be youtube resource type');
});

test('isPDFResource', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'handouts'
  });

  assert.ok(model.get('isPDFResource'), 'It should be pdf resource type');
});
test('isVimeoResource', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'vimeo/video'
  });

  assert.ok(model.get('isVimeoResource'), 'It should be vimeo resource type');
});

test('isHotTextHighlightWord', function(assert) {
  assert.expect(1);
  var answers = Ember.A();
  Ember.run(function () {
    answers.pushObject(Ember.Object.create({highlightType: 'word'}));
  });
  let model = this.subject({
    answers
  });

  assert.ok(model.get('isHotTextHighlightWord'), 'It should be hot text word');
});

test('isHotTextHighlightSentence', function(assert) {
  assert.expect(1);
  var answers = Ember.A();
  Ember.run(function () {
    answers.pushObject(Ember.Object.create({highlightType: 'sentence'}));
  });
  let model = this.subject({
    answers
  });

  assert.ok(model.get('isHotTextHighlightSentence'), 'It should be hot text sentence');
});

test('hasAnswers', function(assert) {
  assert.expect(1);

  var answers = Ember.A();
  Ember.run(function () {
    answers.pushObject(Ember.Object.create({id: 1}));
  });

  let model = this.subject({
    answers
  });

  assert.ok(model.get('hasAnswers'), 'It should have answers');
});

test('assetUrl', function(assert) {
  let model = this.subject({
    assetUrl:'/basePath/url'
  });

  assert.equal(model.get('assetUrl'), '/basePath/url', 'Wrong value for assetUrl');
});

test('isUrlResource', function(assert) {
  assert.expect(1);
  let model = this.subject({
    'type': 'resource/url'
  });

  assert.ok(model.get('isUrlResource'), 'It should be url resource type');
});
