/* TODO fix when the question type is enabled
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player/questions/qz-hs-text', 'Integration | Component | player/questions/qz hs text', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set('locale', 'en');
    this.inject.service('i18n');
  }
});

test('Layout', function (assert) {

  let question = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana'}),
      Ember.Object.create({ 'id': 2, 'text': 'Orange'}),
      Ember.Object.create({ 'id': 3, 'text': 'Apple'}),
      Ember.Object.create({ 'id': 4, 'text': 'Watermelon'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-text question=question}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal($answersContainer.find('li.answer').length, 4, 'Incorrect number of answer choices');

  assert.equal($answersContainer.find('li.answer:first-child').data('id'), 1, 'First answer choice, data-id value is incorrect');
  assert.equal($answersContainer.find('li.answer:first-child span.gru-math-text').text().trim(), 'Banana', 'First answer choice does not have the right text');
  assert.equal($answersContainer.find('li.answer:last-child').data('id'), 4, 'Last answer choice, data-id value is incorrect');
  assert.equal($answersContainer.find('li.answer:last-child span.gru-math-text').text().trim(), 'Watermelon', 'Last answer choice does not have the right text');
});

test('Selecting answers', function (assert) {

  let question = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana' }),
      Ember.Object.create({ 'id': 2, 'text': 'Orange'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });
  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-text question=question}}`);

  const $answers = this.$('li.answer');
  const $firstAnswer = $answers.eq(0);
  const $secondAnswer = $answers.eq(1);

  assert.equal(this.$('li.selected').length, 0, 'Initial number of answers selected is incorrect');

  $firstAnswer.click();
  assert.ok($firstAnswer.hasClass('selected'), 'First answer should have been selected');

  $secondAnswer.click();
  assert.ok($secondAnswer.hasClass('selected'), 'Second answer should have been selected');
  assert.equal(this.$('li.selected').length, 2, 'Incorrect number of answers selected');

  $firstAnswer.click();
  assert.ok(!$firstAnswer.hasClass('selected'), 'First answer should have been deselected');
  assert.equal(this.$('li.selected').length, 1, 'Incorrect number of answers selected');

  $secondAnswer.click();
  assert.ok(!$secondAnswer.hasClass('selected'), 'Second answer should have been deselected');
  assert.equal(this.$('li.selected').length, 0, 'Incorrect number of answers selected');
});

test('Notifications work after selecting questions', function (assert) {

  var answers = [];
  let question = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana' }),
      Ember.Object.create({ 'id': 2, 'text': 'Orange'}),
      Ember.Object.create({ 'id': 3, 'text': 'Apple'}),
      Ember.Object.create({ 'id': 4, 'text': 'Watermelon'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });

  this.set('question', question);

  this.on('changeAnswer', function (question, answer) {
    assert.deepEqual(answer, answers, 'Answer changed, but the answers are not correct');
  });

  this.on('completeAnswer', function (question, answer) {
    assert.deepEqual(answer, answers, 'Answer completed, but the answers are not correct');
  });

  this.on('clearAnswer', function (question, answer) {
    assert.deepEqual(answer, answers, 'Answer cleared, but the answers are not correct');
  });

  this.render(hbs`{{player/questions/qz-hs-text question=question
                    onAnswerChanged='changeAnswer'
                    onAnswerCompleted='completeAnswer'
                    onAnswerCleared='clearAnswer' }}`);

  const $answers = this.$('li.answer');

  // Select first answer
  answers = [1];
  $answers.eq(0).click();

  answers = [1, 3];
  $answers.eq(2).click();

  // Three answers selected
  answers = [1,3,4];
  $answers.eq(3).click();

  // Now, test deselecting all answers
  answers = [1,4];
  $answers.eq(2).click();

  answers = [4];
  $answers.eq(0).click();

  // Send onAnswerCleared notification
  answers = [];
  $answers.eq(3).click();
});

test('Layout - read only', function (assert) {

  let question = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana' }),
      Ember.Object.create({ 'id': 2, 'text': 'Orange'}),
      Ember.Object.create({ 'id': 3, 'text': 'Apple'}),
      Ember.Object.create({ 'id': 4, 'text': 'Watermelon'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-text question=question readOnly=true}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal($answersContainer.find('li.answer.disabled').length, 4, 'Incorrect number of answer choices');
});

test('Layout - with user answer', function (assert) {
  assert.expect(5);
  let question = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana' }),
      Ember.Object.create({ 'id': 2, 'text': 'Orange'}),
      Ember.Object.create({ 'id': 3, 'text': 'Apple'}),
      Ember.Object.create({ 'id': 4, 'text': 'Watermelon'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });

  const answers = [1,3];
  this.on('changeAnswer', function (question, answer) {
    assert.deepEqual(answer, answers, 'Answer changed, but the answers are not correct');
  });
  this.on('loadAnswer', function (question, answer) {
    assert.deepEqual(answer, answers, 'Answer loaded, but the answers are not correct');
  });
  this.set('question', question);
  this.set('userAnswer', [1,3]);

  this.render(hbs`{{player/questions/qz-hs-text question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal($answersContainer.find('li.answer').length, 4, 'Incorrect number of answer choices');
  assert.equal($answersContainer.find('li.answer.selected').length, 2, '2 should be selected');
});

test('Set two questions', function (assert) {
  let question = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana' }),
      Ember.Object.create({ 'id': 2, 'text': 'Orange'}),
      Ember.Object.create({ 'id': 3, 'text': 'Apple'}),
      Ember.Object.create({ 'id': 4, 'text': 'Watermelon'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });
  let question1 = Ember.Object.create({
    'id': '569906aabfcfc4cfc1b29b62',
    questionType: 'HS_TXT',
    text: 'Sample Question HS_TXT',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      Ember.Object.create({ 'id': 1, 'text': 'Banana1' }),
      Ember.Object.create({ 'id': 2, 'text': 'Orange1'}),
      Ember.Object.create({ 'id': 3, 'text': 'Apple1'}),
      Ember.Object.create({ 'id': 4, 'text': 'Watermelon1'})
    ]),
    'resourceType': 'assessment-question',
    'resourceFormat': 'question',
    'order': 8,
    'hasAnswers': true
  });
  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-text question=question}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.equal($answersContainer.find('li.answer:first-child span.gru-math-text').text().trim(), 'Banana', 'First answer choice does not have the right text');
  assert.equal($answersContainer.find('li.answer:last-child span.gru-math-text').text().trim(), 'Watermelon', 'Last answer choice does not have the right text');
  this.set('question', question1);

  assert.equal($answersContainer.find('li.answer:first-child span.gru-math-text').text().trim(), 'Banana1', 'First answer choice does not have the right text');
  assert.equal($answersContainer.find('li.answer:last-child span.gru-math-text').text().trim(), 'Watermelon1', 'Last answer choice does not have the right text');
});
*/