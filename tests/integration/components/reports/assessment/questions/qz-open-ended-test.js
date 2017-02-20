import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import AnswerModel from 'quizzes/models/resource/answer';
import ResourceModel from 'quizzes/models/resource/resource';
import QuestionResult from 'quizzes/models/result/question';
import { QUESTION_TYPES } from 'quizzes/config/question';

moduleForComponent('reports/assessment/questions/qz-open-ended', 'Integration | Component | reports/assessment/questions/qz-open-ended', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set('locale','en');
  }
});

test('Open ended Layout showing correct answer', function (assert) {
  assert.expect(2);

  let showCorrect = true;
  let questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: 'Correct answer' })
      ])
    })
  });
  this.set('question', questionResult);
  this.set('showCorrect', showCorrect);

  this.render(hbs`{{reports/assessment/questions/qz-open-ended showCorrect=showCorrect question=question}}`);

  const $component = this.$(); //component dom element
  const $answer = $component.find('.answer');

  T.exists(assert, $answer, 'Missing answer');
  assert.equal(T.text($answer), 'Correct answer', 'Wrong correct answer');
});

test('Open ended Layout showing user answer', function (assert) {
  assert.expect(2);
  let questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: 'Correct answer' })
      ])
    })
  });
  this.set('question', questionResult);
  this.set('answer', [{ value: 'My Answer' }]);

  this.render(hbs`{{reports/assessment/questions/qz-open-ended question=question userAnswer=answer}}`);

  const $component = this.$(); //component dom element
  const $answer = $component.find('.answer');

  T.exists(assert, $answer, 'Missing answer');
  assert.equal(T.text($answer), 'My Answer', 'Wrong answer text');
});

test('Open ended Layout when no answer provided', function (assert) {
  assert.expect(2);

  let questionResult = QuestionResult.create({
    resource: ResourceModel.create({
      id: '569906aa20b7dfae1bcd5',
      type: QUESTION_TYPES.openEnded,
      body: 'Sample Question MA',
      correctAnswer: Ember.A([
        AnswerModel.create({ value: 'Correct answer' })
      ])
    })
  });

  this.set('question', questionResult);
  this.render(hbs`{{reports/assessment/questions/qz-open-ended question=question userAnswer=answer}}`);

  const $component = this.$(); //component dom element
  const $answer = $component.find('.answer');

  T.exists(assert, $answer, 'Missing answer');
  assert.equal(T.text($answer), '', 'Wrong answer text');
});
