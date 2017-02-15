import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import AnswerModel from 'quizzes/utils/question/answer-object';
import ResourceModel from 'quizzes/models/resource/resource';

moduleForComponent('player/questions/qz-fib', 'Unit | Component | player/questions/qz fib', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('answers without user answer', function(assert) {
  let component = this.subject();
  component.set('question',ResourceModel.create({body:'The sun is []'}));
  assert.equal(component.get('answers'),`The sun is <input type='text' value='' />`);
});

test('answers with user answer', function(assert) {
  let component = this.subject();
  let question = ResourceModel.create({body:'The sun is []',answers: Ember.A([
    AnswerModel.create({
      value: 'yellow',
      text: 'yellow'
    })
  ]),
    hasAnswers: true});
  component.set('question',question);
  component.set('userAnswer', [{value:'yellow'}]);
  assert.equal(component.get('answers'),`The sun is <input type='text' value='yellow' />`);
});
