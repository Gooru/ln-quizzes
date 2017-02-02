import { moduleForComponent, test } from 'ember-qunit';
import Answer from 'quizzes/models/resource/answer';
import Ember from 'ember';

moduleForComponent('reports/assessment/questions/qz-reorder', 'Unit | Component | reports/assessment/questions/qz reorder', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});
test('answers when show correct', function(assert) {
  let component = this.subject();
  var question = Ember.Object.create({
    questionType: "drag_and_drop",
    question:{
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica'}),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer:Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica'}),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  let expectedAnswers = Ember.A([
    {
      selectedOrder: 1,
      text: 'Costa Rica',
      correct:true
    },
    {
      selectedOrder: 2,
      text: 'Brasil',
      correct:true
    },
    {
      selectedOrder: 3,
      text: 'Panamá',
      correct:true
    },
    {
      selectedOrder: 4,
      text: 'Chile',
      correct:true
    }
  ]);
  component.set('showCorrect', true);
  component.set('question', question);
  assert.deepEqual(component.get('answers'),expectedAnswers,'Incorrect answers');
});
test('answers show user answers', function(assert) {
  let component = this.subject();
  var question = Ember.Object.create({
    questionType: "drag_and_drop",
    question:{
      answers: Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica'}),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ]),
      correctAnswer:Ember.A([
        Answer.create({ value: 'crc', text: 'Costa Rica'}),
        Answer.create({ value: 'bra', text: 'Brasil' }),
        Answer.create({ value: 'pan', text: 'Panamá' }),
        Answer.create({ value: 'chi', text: 'Chile' })
      ])
    }
  });
  let expectedAnswers = Ember.A([
    {
      selectedOrder: 4,
      text: 'Costa Rica',
      correct:false
    },
    {
      selectedOrder: 3,
      text: 'Brasil',
      correct:false
    },
    {
      selectedOrder: 1,
      text: 'Panamá',
      correct:false
    },
    {
      selectedOrder: 2,
      text: 'Chile',
      correct:false
    }
  ]);
  component.set('question', question);
  component.set('userAnswer', [{value:'pan'}, {value:'chi'},{value:'bra'},{value:'crc'}]);
  assert.deepEqual(component.get('answers'),expectedAnswers,'Incorrect answers');
});
