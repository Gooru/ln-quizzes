import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';
import AnswerModel from 'quizzes/utils/question/answer-object';
import ResourceModel from 'quizzes/models/resource/resource';

moduleForComponent('reports/assessment/questions/qz-fib', 'Integration | Component | reports/assessment/questions/qz-fib', {
  integration: true
});

test('Fill in the blank Correct Answer', function(assert) {

  var question = Ember.Object.create({
    question:ResourceModel.create({
      questionType: 'text_entry',
      body: 'The mountain is [] and the sky []',
      hints: [],
      explanation: 'Sample explanation text',
      answers:Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        }),
        AnswerModel.create({
          value: 'blue',
          text: 'blue'
        })
      ]),
      correctAnswer:Ember.A([
        AnswerModel.create({ value: 'green'}),
        AnswerModel.create({ value: 'blue'})
      ]),
      sequence:1
    })
  });

  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);

  this.render(hbs`{{reports/assessment/questions/qz-fib question=question showCorrect=showCorrect}}`);

  const $component = this.$(); //component dom element
  const $fib = $component.find(".reports.assessment.questions.qz-fib");

  T.exists(assert, $fib, 'Missing fill in the blank component');
  T.exists(assert, $fib.find('> span:eq(1).answer.correct'), 'The first answer should be correct');
  T.exists(assert, $fib.find('> span:eq(3).answer.correct'), 'The second answer should be correct');
  T.notExists(assert, $fib.find('span.answer.incorrect'), 'Should not be incorrect answers at all');
});

test('Fill in the blank Your Answer Incorrect', function(assert) {

  var question = Ember.Object.create({
    question:ResourceModel.create({
      questionType: 'text_entry',
      body: 'The mountain is [] and the sky []',
      hints: [],
      explanation: 'Sample explanation text',
      answers:Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        }),
        AnswerModel.create({
          value: 'blue',
          text: 'blue'
        })
      ]),
      correctAnswer:Ember.A([
        AnswerModel.create({ value: 'green'}),
        AnswerModel.create({ value: 'blue'})
      ]),
      sequence:1
    })
  });

  var userAnswer = Ember.A([{value:'yellow'},{value:'blue'}]);
  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(hbs`{{reports/assessment/questions/qz-fib question=question userAnswer=userAnswer}}`);
  const $component = this.$(); //component dom element
  const $fib = $component.find(".reports.assessment.questions.qz-fib");
  T.exists(assert, $fib, 'Missing fill in the blank component');
  T.exists(assert, $fib.find('> span:eq(1).answer.incorrect'), 'The first answer should be incorrect');
  T.exists(assert, $fib.find('> span:eq(3).answer.correct'), 'The second answer should be correct');
});

test('Fill in the blank Your Answer Correct', function(assert) {

  var question = Ember.Object.create({
    question:ResourceModel.create({
      questionType: 'text_entry',
      body: 'The mountain is [] and the sky []',
      hints: [],
      explanation: 'Sample explanation text',
      answers:Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        }),
        AnswerModel.create({
          value: 'blue',
          text: 'blue'
        })
      ]),
      correctAnswer:Ember.A([
        AnswerModel.create({ value: 'green'}),
        AnswerModel.create({ value: 'blue'})
      ]),
      sequence:1
    })
  });

  var userAnswer = Ember.A([{value:'green'},{value:'blue'}]);
  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(hbs`{{reports/assessment/questions/qz-fib question=question userAnswer=userAnswer}}`);
  const $component = this.$(); //component dom element
  const $fib = $component.find(".reports.assessment.questions.qz-fib");
  T.exists(assert, $fib, 'Missing fill in the blank component');
  T.exists(assert, $fib.find('> span:eq(1).answer.correct'), 'The first answer should be correct');
  T.exists(assert, $fib.find('> span:eq(3).answer.correct'), 'The second answer should be correct');
  T.notExists(assert, $fib.find('span.answer.incorrect'), 'Should not be incorrect answers at all');
});

test('Fill in the blank anonymous', function(assert) {

  var question = Ember.Object.create({
    question:ResourceModel.create({
      questionType: 'text_entry',
      body: 'The mountain is [] and the sky []',
      hints: [],
      explanation: 'Sample explanation text',
      answers:Ember.A([
        AnswerModel.create({
          value: 'green',
          text: 'green'
        }),
        AnswerModel.create({
          value: 'blue',
          text: 'blue'
        })
      ]),
      correctAnswer:Ember.A([
        AnswerModel.create({ value: 'green'}),
        AnswerModel.create({ value: 'blue'})
      ]),
      sequence:1
    })
  });

  var userAnswer = Ember.A([{value:'green'},{value:'blue'}]);
  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(hbs`{{reports/assessment/questions/qz-fib question=question userAnswer=userAnswer anonymous=true}}`);
  const $component = this.$(); //component dom element
  const $fib = $component.find(".reports.assessment.questions.qz-fib");
  T.exists(assert, $fib, 'Missing fill in the blank component');
  T.exists(assert, $fib.find('> span:eq(1).answer.anonymous'), 'The first answer should be anonymous');
  T.exists(assert, $fib.find('> span:eq(3).answer.anonymous'), 'The second answer should be anonymous');
});

