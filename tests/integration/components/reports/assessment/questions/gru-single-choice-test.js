import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import Resource from 'quizzes/models/resource/resource';
import Answer from 'quizzes/models/resource/answer';

moduleForComponent('reports/assessment/questions/gru-single-choice', 'Integration | Component | reports/assessment/questions/gru single choice', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set('locale', 'en');
    this.inject.service('i18n');
  }
});

test('Single Choice Correct Answer', function(assert) {
  let question = QuestionResult.create({
    resource: Resource.create({
      type: 'single_choice',
      correctAnswer: [{ value: '3' }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  let showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.render(hbs`{{reports/assessment/questions/gru-single-choice question=question showCorrect=showCorrect}}`);
  const $component = this.$(); //component dom element
  const $singleChoice = $component.find('.reports.assessment.questions.gru-single-choice');

  T.exists(assert, $singleChoice, 'Missing single choice component');
  T.exists(assert, $singleChoice.find('li:nth-child(1) span i.radio_button_unchecked'), 'The first answer should be unchecked');
  T.exists(assert, $singleChoice.find('li:nth-child(2) span i.radio_button_unchecked'), 'The second answer should be unchecked');
  T.exists(assert, $singleChoice.find('li:nth-child(3) span.correct i.radio_button_checked'), 'The third answer should be checked and correct');
});

test('Single Choice Your Answer Incorrect', function(assert) {
  let question = QuestionResult.create({
    answer: [{
      value: '1'
    }],
    score: 0,
    resource: Resource.create({
      type: 'single_choice',
      correctAnswer: [{
        value: '3'
      }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  this.set('question', question);

  this.render(hbs`{{reports/assessment/questions/gru-single-choice question=question}}`);
  const $component = this.$(); //component dom element
  const $singleChoice = $component.find('.reports.assessment.questions.gru-single-choice');
  T.exists(assert, $singleChoice, 'Missing single choice component');
  T.exists(assert, $singleChoice.find('li:nth-child(1) span.incorrect i.radio_button_checked'), 'The first answer should be checked and incorrect');
  T.exists(assert, $singleChoice.find('li:nth-child(2) span i.radio_button_unchecked'), 'The second answer should be unchecked');
  T.exists(assert, $singleChoice.find('li:nth-child(3) span i.radio_button_unchecked'), 'The third answer should be unchecked');
});

test('Single Choice Your Answer Correct', function(assert) {
  let question = QuestionResult.create({
    answer: [{
      value: '3'
    }],
    score: 100,
    resource: Resource.create({
      type: 'single_choice',
      correctAnswer: [{
        value: '3'
      }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  this.set('question', question);

  this.render(hbs`{{reports/assessment/questions/gru-single-choice question=question}}`);
  const $component = this.$(); //component dom element
  const $singleChoice = $component.find('.reports.assessment.questions.gru-single-choice');
  T.exists(assert, $singleChoice, 'Missing single choice component');
  T.exists(assert, $singleChoice.find('li:nth-child(1) span i.radio_button_unchecked'), 'The first answer should be unchecked');
  T.exists(assert, $singleChoice.find('li:nth-child(2) span i.radio_button_unchecked'), 'The second answer should be unchecked');
  T.exists(assert, $singleChoice.find('li:nth-child(3) span.correct i.radio_button_checked'), 'The third answer should be checked and correct');
});

test('Single Choice anonymous', function(assert) {
  let question = QuestionResult.create({
    answer: [{
      value: '3'
    }],
    score: 100,
    resource: Resource.create({
      type: 'single_choice',
      correctAnswer: [{
        value: '3'
      }],
      answers: Ember.A([
        Answer.create({ value: '1', text: 'Answer 1' }),
        Answer.create({ value: '2', text: 'Answer 2' }),
        Answer.create({ value: '3', text: 'Answer 3' })
      ])
    })
  });
  this.set('question', question);

  this.render(hbs`{{reports/assessment/questions/gru-single-choice question=question anonymous=true}}`);
  const $component = this.$(); //component dom element
  const $singleChoice = $component.find('.reports.assessment.questions.gru-single-choice');
  T.exists(assert, $singleChoice, 'Missing single choice component');
  T.exists(assert, $singleChoice.find('li:nth-child(3) span.anonymous'), 'The third answer is anonymous');
});
