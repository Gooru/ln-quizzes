import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/teacher-context-event', 'Unit | Model | result/teacher-context-event');

test('questionResults', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create(),
      ResourceResult.create(),
      QuestionResult.create()
    ])
  });

  assert.equal(contextResult.get('questionResults').get('length'), 1, 'Wrong question results');
});
