import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Collection from 'quizzes/models/collection/collection';
import Resource from 'quizzes/models/resource/resource';
import ContextResult from 'quizzes/models/result/context';
import QuestionResult from 'quizzes/models/result/question';

moduleForComponent('player/qz-player', 'Unit | Component | player/qz player', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('finishCollection on collection', function(assert) {
  assert.expect(5);
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let question = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    isCollection: true,
    nextResource: function(q) {
      assert.deepEqual(q, question);
      return null;
    }
  });
  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context'
  });
  let component = this.subject({
    collection,
    contextResult,
    resource: question,
    resourceResult: questionResult,
    contextService: Ember.Object.create({
      finishContext: function(contextId) {
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        return Ember.RSVP.resolve();
      },
      moveToResource: function(resourceId, contextId, resourceResult) {
        assert.deepEqual(resourceId, null, 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        return Ember.RSVP.resolve();
      }
    })
  });

  Ember.run(function() {
    component.send('finishCollection');
  });
});

test('finishCollection on assessment', function(assert) {
  assert.expect(1);
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  let component = this.subject({
    collection
  });
  component.set('actions.showModal', function(modal) {
    assert.equal(modal, 'modals.gru-submit-confirmation', 'Correct modal');
  });

  component.send('finishCollection');
});

test('submitQuestion with next question available', function(assert) {
  assert.expect(9);
  let question = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  let question2 = Resource.create(Ember.getOwner(this).ownerInjection(), {
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
  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question2.get('id'), 'Question ids should match');
      return questionResult2;
    }
  });
  let component = this.subject({
    collection,
    resource: question,
    resourceResult: questionResult,
    contextResult,
    contextService: Ember.Object.create({
      moveToResource: function(resourceId, contextId, resourceResult) {
        assert.deepEqual(resourceId, 'question-id', 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        return Ember.RSVP.resolve();
      }
    })
  });

  Ember.run(function() {
    component.send('submitQuestion', question, questionResult);
  });

  assert.notOk(component.get('showReport'), 'showReport updated');
  assert.deepEqual(component.get('resource'), question2, 'resource property updated');
  assert.deepEqual(component.get('resourceId'), 'question-id', 'resourceId property updated');
  assert.deepEqual(component.get('resourceResult'), questionResult2, 'resourceResult property updated');
});

test('submitQuestion with next question unavailable', function(assert) {
  assert.expect(5);
  let question = Resource.create(Ember.getOwner(this).ownerInjection(), {
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
  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context'
  });

  let component = this.subject({
    collection,
    resource: question,
    resourceResult: questionResult,
    contextResult,
    contextService: Ember.Object.create({
      moveToResource: function(resourceId, contextId, resourceResult) {
        assert.deepEqual(resourceId, null, 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        return Ember.RSVP.resolve();
      }
    })
  });

  component.set('actions.showModal', function(modal) {
    assert.equal(modal, 'modals.gru-submit-confirmation', 'Correct modal');
  });

  Ember.run(function() {
    component.send('submitQuestion', question);
  });
});

test('selectNavigatorItem', function(assert) {
  assert.expect(8);
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  let question = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let questionResult2 = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question.get('id'), 'Question ids should match');
      return questionResult;
    }
  });
  let component = this.subject({
    collection,
    resourceResult: questionResult2,
    contextResult,
    contextService: Ember.Object.create({
      moveToResource: function(resourceId, contextId, resourceResult) {
        assert.deepEqual(resourceId, 'question-id', 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult2, 'Wrong result object');
        return Ember.RSVP.resolve();
      }
    })
  });

  Ember.run(function() {
    component.send('selectNavigatorItem', question);
  });

  assert.notOk(component.get('showReport'), 'showReport updated');
  assert.deepEqual(component.get('resource'), question, 'resource property updated');
  assert.deepEqual(component.get('resourceId'), 'question-id', 'resourceId property updated');
  assert.deepEqual(component.get('resourceResult'), questionResult, 'resourceResult property updated');
});

test('changeEmotion', function(assert) {
  assert.expect(1);
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let component = this.subject({
    collection,
    resourceResult: questionResult
  });
  let emotion = 'emotion';
  component.send('changeEmotion', emotion);

  assert.equal(questionResult.get('reaction'), 'emotion', 'reactionType should be updated');
});
