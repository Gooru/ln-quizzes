import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import Resource from 'quizzes/models/resource/resource';
import Answer from 'quizzes/models/resource/answer';

moduleForComponent('reports/assessment/questions/gru-true-false', 'Integration | Component | reports/assessment/questions/gru true false', {
  integration: true
});

test('True False Correct Answer', function (assert) {
  let question = QuestionResult.create({
    resource: Resource.create({
      type: 'true_false',
      correctAnswer: [{ value: '2' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'True' }),
        Answer.create({ value: '2', text: 'False' })
      ])
    })
  });

  let showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);

  this.render(hbs`{{reports/assessment/questions/gru-true-false question=question showCorrect=showCorrect}}`);

  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('li:nth-child(1) span i.radio_button_unchecked'), 'The first answer should be unchecked');
  T.exists(assert, $component.find('li:nth-child(2) span.correct i.radio_button_checked'), 'The second answer should be checked and correct');
});

test('True False Your Answer Incorrect', function (assert) {
  let question = QuestionResult.create({
    answer: [{ value: '1' }],
    score: 0,
    resource: Resource.create({
      type: 'true_false',
      correctAnswer: [{ value: '2' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'True' }),
        Answer.create({ value: '2', text: 'False' })
      ])
    })
  });
  this.set('question', question);

  this.render(hbs`{{reports/assessment/questions/gru-true-false question=question}}`);
  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('li:nth-child(1) span.incorrect i.radio_button_checked'), 'The first answer should be checked and incorrect');
  T.exists(assert, $component.find('li:nth-child(2) span i.radio_button_unchecked'), 'The second answer should be unchecked');
});

test('True False Your Answer Correct', function (assert) {

  let question = QuestionResult.create({
    answer: [{ value: '2' }],
    score: 100,
    resource: Resource.create({
      type: 'true_false',
      correctAnswer: [{ value: '2' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'True' }),
        Answer.create({ value: '2', text: 'False' })
      ])
    })
  });
  this.set('question', question);

  this.render(hbs`{{reports/assessment/questions/gru-true-false question=question}}`);
  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('li:nth-child(1) span i.radio_button_unchecked'), 'The first answer should be unchecked');
  T.exists(assert, $component.find('li:nth-child(2) span.correct i.radio_button_checked'), 'The second answer should be checked and correct');
});

test('True False anonymous', function (assert) {
  let question = QuestionResult.create({
    answer: [{ value: '2' }],
    score: 100,
    resource: Resource.create({
      type: 'true_false',
      correctAnswer: [{ value: '2' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'True' }),
        Answer.create({ value: '2', text: 'False' })
      ])
    })
  });
  this.set('question', question);

  this.render(hbs`{{reports/assessment/questions/gru-true-false question=question anonymous=true}}`);
  const $component = this.$(); //component dom element
  T.exists(assert, $component.find('li:nth-child(1) span i.radio_button_unchecked'), 'The first answer should be unchecked');
  T.exists(assert, $component.find('li:nth-child(2) span.anonymous'), 'The second answer should be anonymous');
});
