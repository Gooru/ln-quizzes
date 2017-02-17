import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import Resource from 'quizzes/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes/config/question';

moduleForComponent('reports/assessment/gru-questions-xs', 'Integration | Component | reports/assessment/gru questions xs', {
  integration: true
});

test('Questions Details Mobile Layout', function(assert) {
  assert.expect(6);

  const questions = Ember.A([
    QuestionResult.create({
      question: Resource.create({
        body: 'This is a question 1',
        type: QUESTION_TYPES.openEnded,
        sequence: 1
      }),
      score: 100,
      savedTime: 10000,
      reaction: 5,
      answer: 'answer'
    }),
    QuestionResult.create({
      question: Resource.create({
        body: 'This is a question 2',
        type: QUESTION_TYPES.openEnded,
        sequence: 2
      }),
      score: 0,
      savedTime: 25000, //seconds
      reaction: 2,
      answer: 'answer'
    })]);

  this.set('questions', questions);
  this.render(hbs`{{reports/assessment/gru-questions-xs results=questions}}`);
  const $component = this.$(); //component dom element
  const $question = $component.find('.gru-questions-xs');

  T.exists(assert, $question, 'Missing questions-xs component');
  T.exists(assert, $question.find('.question-number'), 'Missing question number column');
  T.exists(assert, $question.find('.question-text'), 'Missing question text column');
  T.exists(assert, $question.find('.question-container'), 'Missing question container');
  T.exists(assert, $question.find('.question'), 'Missing question section');
  T.exists(assert, $question.find('.answer'), 'Missing answer section');
});
