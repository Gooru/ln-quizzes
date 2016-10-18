import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Assessment from 'quizzes/models/content/assessment';
import Collection from 'quizzes/models/content/collection';
import Question from 'quizzes/models/content/question';
import AssessmentResult from 'quizzes/models/result/assessment';
import QuestionResult from 'quizzes/models/result/question';

moduleFor('controller:player', 'Unit | Controller | player', {

});

test('finishCollection on collection', function(assert) {
  assert.expect(1);
  let controller = this.subject();
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title'
  });
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context'
  });
  controller.set('collection', collection);
  controller.set('assessmentResult', assessmentResult);
  controller.set('eventsService', Ember.Object.create({
    endContext: function(contextId) {
      assert.deepEqual(contextId, 'context', 'Wrong context id');
      return Ember.RSVP.resolve();
    }
  }));

  Ember.run(function() {
    controller.send('finishCollection');
  });
});

test('finishCollection on assessment', function(assert) {
  assert.expect(1);
  let controller = this.subject();
  let collection = Assessment.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title'
  });
  controller.set('collection', collection);
  controller.set('actions.showModal', function(modal) {
    assert.equal(modal, 'content.modals.gru-submit-confirmation', 'Correct modal');
  });

  controller.send('finishCollection');
});

test('submitQuestion with next question available', function(assert) {
  assert.expect(9);
  let controller = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  let question2 = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    nextResource: function(q) {
      assert.deepEqual(q, question);
      return question2;
    }
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let questionResult2 = QuestionResult.create(Ember.getOwner(this).ownerInjection(), {
    pending: true,
    startedAt: 'any-date'
  });
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question2.get('id'), 'Question ids should match');
      return questionResult2;
    }
  });
  controller.set('collection', collection);
  controller.set('resource', question);
  controller.set('assessmentResult', assessmentResult);
  controller.set('resourceResult', questionResult);
  controller.set('eventsService', Ember.Object.create({
    moveToResource: function(resourceId, contextId, resourceResult) {
      assert.deepEqual(resourceId, 'question-id', 'Wrong resource id');
      assert.deepEqual(contextId, 'context', 'Wrong context id');
      assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
      return Ember.RSVP.resolve();
    }
  }));

  Ember.run(function() {
    controller.send('submitQuestion', question, questionResult);
  });

  assert.notOk(controller.get('showReport'), 'showReport updated');
  assert.deepEqual(controller.get('resource'), question2, 'resource property updated');
  assert.deepEqual(controller.get('resourceId'), 'question-id', 'resourceId property updated');
  assert.deepEqual(controller.get('resourceResult'), questionResult2, 'resourceResult property updated');
});

test('submitQuestion with next question unavailable', function(assert) {
  assert.expect(5);
  let controller = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    nextResource: function(q) {
      assert.deepEqual(q, question);
      return null;
    }
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  controller.set('collection', collection);
  controller.set('resource', question);
  controller.set('resourceResult', questionResult);
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context'
  });
  controller.set('assessmentResult', assessmentResult);
  controller.set('eventsService', Ember.Object.create({
    moveToResource: function(resourceId, contextId, resourceResult) {
      assert.deepEqual(resourceId, null, 'Wrong resource id');
      assert.deepEqual(contextId, 'context', 'Wrong context id');
      assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('actions.showModal', function(modal) {
    assert.equal(modal, 'content.modals.gru-submit-confirmation', 'Correct modal');
  });

  Ember.run(function() {
    controller.send('submitQuestion', question);
  });
});

test('selectNavigatorItem', function(assert) {
  assert.expect(8);
  let controller = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let questionResult2 = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question.get('id'), 'Question ids should match');
      return questionResult;
    }
  });
  controller.set('assessmentResult', assessmentResult);
  controller.set('resourceResult', questionResult2);
  controller.set('eventsService', Ember.Object.create({
    moveToResource: function(resourceId, contextId, resourceResult) {
      assert.deepEqual(resourceId, 'question-id', 'Wrong resource id');
      assert.deepEqual(contextId, 'context', 'Wrong context id');
      assert.deepEqual(resourceResult, questionResult2, 'Wrong result object');
      return Ember.RSVP.resolve();
    }
  }));

  Ember.run(function() {
    controller.send('selectNavigatorItem', question);
  });

  assert.notOk(controller.get('showReport'), 'showReport updated');
  assert.deepEqual(controller.get('resource'), question, 'resource property updated');
  assert.deepEqual(controller.get('resourceId'), 'question-id', 'resourceId property updated');
  assert.deepEqual(controller.get('resourceResult'), questionResult, 'resourceResult property updated');
});

test('changeEmotion', function(assert) {
  assert.expect(1);
  let controller = this.subject();
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let emotion = 'emotion';
  controller.set('resourceResult', questionResult);

  controller.send('changeEmotion', emotion);

  assert.equal(questionResult.get('reaction'), 'emotion', 'reactionType should be updated');
});
