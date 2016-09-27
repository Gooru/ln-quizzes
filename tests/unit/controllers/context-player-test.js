import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Assessment from 'gooru-web/models/content/assessment';
import Collection from 'gooru-web/models/content/collection';
import Question from 'gooru-web/models/content/question';
import Context from 'gooru-web/models/result/context';
import AssessmentResult from 'gooru-web/models/result/assessment';
import QuestionResult from 'gooru-web/models/result/question';
import ResourceResult from 'gooru-web/models/result/resource';

moduleFor('controller:context-player', 'Unit | Controller | context player', {
});

test('finishCollection on collection and anonymous', function(assert) {
  assert.expect(9);
  let controller = this.subject();
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title'
  });
  let resourceResult = ResourceResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection());
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    isStudent: false
  });

  controller.set('session', Ember.Object.create({
    isAnonymous: true
  }));
  controller.set('collection', collection);
  controller.set('resourceResult', resourceResult);
  controller.set('assessmentResult', assessmentResult);
  controller.set('context', context);
  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return true;
    }
  }));
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.deepEqual(result, resourceResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    },
    saveCollectionResult: function(result, cont){
      assert.deepEqual(result, assessmentResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    }
  }));

  Ember.run(function() {
    controller.send('finishCollection');
  });

  assert.ok(controller.get('showReport'), 'showReport updated');
  assert.ok(resourceResult.get('submittedAt'), 'submittedAt for resource updated');
  assert.ok(assessmentResult.get('submittedAt'), 'submittedAt for assessment updated');
  assert.equal(context.get('eventType'), 'stop', 'eventType updated');
  assert.notOk(context.get('isStudent'), 'isStudent updated');
});

test('finishCollection on collection and not anonymous', function(assert) {
  assert.expect(9);
  let controller = this.subject();
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title'
  });
  let resourceResult = ResourceResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection());
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    isStudent: false
  });
  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('collection', collection);
  controller.set('resourceResult', resourceResult);
  controller.set('assessmentResult', assessmentResult);
  controller.set('context', context);
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.deepEqual(result, resourceResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    },
    saveCollectionResult: function(result, cont){
      assert.deepEqual(result, assessmentResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('actions.navigateToReport', function() {
    assert.ok(true, 'navigateToReport');
  });

  Ember.run(function() {
    controller.send('finishCollection');
  });

  assert.ok(resourceResult.get('submittedAt'), 'submittedAt for resource updated');
  assert.ok(assessmentResult.get('submittedAt'), 'submittedAt for assessment updated');
  assert.equal(context.get('eventType'), 'stop', 'eventType updated');
  assert.ok(context.get('isStudent'), 'isStudent updated');
});

test('finishCollection on collection and not anonymous', function(assert) {
  assert.expect(9);
  let controller = this.subject();
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title'
  });
  let resourceResult = ResourceResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection());
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    isStudent: true
  });

  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('collection', collection);
  controller.set('resourceResult', resourceResult);
  controller.set('assessmentResult', assessmentResult);
  controller.set('context', context);
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.deepEqual(result, resourceResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    },
    saveCollectionResult: function(result, cont){
      assert.deepEqual(result, assessmentResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('actions.navigateToReport', function() {
    assert.ok(true, 'navigateToReport');
  });

  Ember.run(function() {
    controller.send('finishCollection');
  });

  assert.ok(resourceResult.get('submittedAt'), 'submittedAt for resource updated');
  assert.ok(assessmentResult.get('submittedAt'), 'submittedAt for assessment updated');
  assert.equal(context.get('eventType'), 'stop', 'eventType updated');
  assert.ok(context.get('isStudent'), 'isStudent updated');
});

test('finishCollection on collection, not anonymous and on air', function(assert) {
  assert.expect(16);
  let controller = this.subject();
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title'
  });
  let resourceResult = ResourceResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection());
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    classId: 'class-id',
    collectionId: 'collection-id',
    userId: 'user-id',
    isStudent: true
  });
  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('onAir', true);
  controller.set('collection', collection);
  controller.set('resourceResult', resourceResult);
  controller.set('assessmentResult', assessmentResult);
  controller.set('context', context);
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.deepEqual(result, resourceResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    },
    saveCollectionResult: function(result, cont){
      assert.deepEqual(result, assessmentResult, 'Wrong result object');
      assert.deepEqual(cont, context, 'Wrong context object');
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('realTimeService', Ember.Object.create({
    notifyResourceResult: function(classId, collectionId, userId, result) {
      assert.deepEqual(result, resourceResult, 'Wrong result object');
      assert.equal(classId, 'class-id', 'Wrong class id');
      assert.equal(collectionId, 'collection-id', 'Wrong collection id');
      assert.equal(userId, 'user-id', 'Wrong user id');
      return Ember.RSVP.resolve();
    },
    notifyAttemptFinished: function(classId, collectionId, userId) {
      assert.equal(classId, 'class-id', 'Wrong class id');
      assert.equal(collectionId, 'collection-id', 'Wrong collection id');
      assert.equal(userId, 'user-id', 'Wrong user id');
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('actions.navigateToReport', function() {
    assert.ok(true, 'navigateToReport');
  });

  Ember.run(function() {
    controller.send('finishCollection');
  });

  assert.ok(resourceResult.get('submittedAt'), 'submittedAt for resource updated');
  assert.ok(assessmentResult.get('submittedAt'), 'submittedAt for assessment updated');
  assert.equal(context.get('eventType'), 'stop', 'eventType updated');
  assert.ok(context.get('isStudent'), 'isStudent updated');
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
  assert.expect(16);
  let controller = this.subject();
  let saveCounter = 0;
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
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question2.get('id'), 'Question ids should match');
      return questionResult2;
    }
  });
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    resourceEventId: 'event-id',
    isStudent: true
  });
  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('collection', collection);
  controller.set('resource', question);
  controller.set('assessmentResult', assessmentResult);
  controller.set('resourceResult', questionResult);
  controller.set('context', context);
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.ok(saveCounter < 2, 'saveResourceResult should be called twice');
      if(saveCounter < 1) {
        assert.deepEqual(result, questionResult, 'Wrong first result object');
        assert.equal(context.get('eventType'), 'stop', 'eventType updated');
      } else {
        assert.deepEqual(result, questionResult2, 'Wrong second result object');
        assert.equal(result.get('startedAt'), 'any-date', 'startedAt unchanged');
        assert.equal(context.get('eventType'), 'start', 'eventType updated');
        assert.equal(context.get('resourceEventId'), 'event-id', 'resourceEventId unchanged');
      }
      assert.deepEqual(cont, context, 'Wrong context object');
      saveCounter += 1;
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
  assert.expect(6);
  let controller = this.subject();
  let saveCounter = 0;
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
  let context = Context.create(Ember.getOwner(this).ownerInjection());
  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));
  controller.set('collection', collection);
  controller.set('resource', question);
  controller.set('resourceResult', questionResult);
  controller.set('context', context);
  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.ok(saveCounter < 1, 'saveResourceResult should be called once');
      assert.deepEqual(result, questionResult, 'Wrong first result object');
      assert.equal(context.get('eventType'), 'stop', 'eventType updated');
      assert.deepEqual(cont, context, 'Wrong context object');
      saveCounter += 1;
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('actions.showModal', function(modal) {
    assert.equal(modal, 'content.modals.gru-submit-confirmation', 'Correct modal');
  });

  Ember.run(function() {
    controller.send('submitQuestion', question, questionResult);
  });
});

test('submitQuestion with feedback to show', function(assert) {
  assert.expect(5);
  let controller = this.subject();
  let saveCounter = 0;
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    immediateFeedback: true
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection(), {
    submittedAnswer: false
  });
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    isStudent: true
  });
  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('collection', collection);
  controller.set('resource', question);
  controller.set('resourceResult', questionResult);
  controller.set('context', context);
  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.ok(saveCounter < 1, 'saveResourceResult should be called once');
      assert.deepEqual(result, questionResult, 'Wrong first result object');
      assert.equal(context.get('eventType'), 'stop', 'eventType updated');
      assert.deepEqual(cont, context, 'Wrong context object');
      saveCounter += 1;
      return Ember.RSVP.resolve();
    }
  }));

  Ember.run(function() {
    controller.send('submitQuestion', question, questionResult);
  });
  assert.ok(questionResult.get('submittedAnswer', true));
});

test('submitQuestion with feedback showing', function(assert) {
  assert.expect(2);
  let controller = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    immediateFeedback: true,
    nextResource: function(q) {
      assert.deepEqual(q, question);
      return null;
    }
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection(), {
    submittedAnswer: true
  });
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    isStudent: true
  });
  controller.set('session', Ember.Object.create({
    isAnonymous: false
  }));

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('collection', collection);
  controller.set('resource', question);
  controller.set('resourceResult', questionResult);
  controller.set('context', context);
  controller.set('actions.showModal', function(modal) {
    assert.equal(modal, 'content.modals.gru-submit-confirmation', 'Correct modal');
  });

  Ember.run(function() {
    controller.send('submitQuestion', question, questionResult);
  });
});

test('selectNavigatorItem', function(assert) {
  assert.expect(10);
  let controller = this.subject();
  let collection = Assessment.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title'
  });
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question.get('id'), 'Question ids should match');
      return questionResult;
    }
  });
  let context = Context.create(Ember.getOwner(this).ownerInjection());
  controller.set('collection', collection);
  controller.set('assessmentResult', assessmentResult);
  controller.set('context', context);
  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.deepEqual(result, questionResult, 'Wrong first result object');
      assert.ok(questionResult.get('startedAt'), 'startedAt updated');
      assert.deepEqual(cont, context, 'Wrong context object');
      assert.equal(context.get('eventType'), 'start', 'eventType updated');
      assert.ok(context.get('resourceEventId'), 'resourceEventId generated');
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

test('selectNavigatorItem on air', function(assert) {
  assert.expect(17);
  let controller = this.subject();
  let saveCounter = 0;
  let collection = Assessment.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title'
  });
  let question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let questionResult2 = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let assessmentResult = AssessmentResult.create(Ember.getOwner(this).ownerInjection(), {
    getResultByResourceId: function(resourceId) {
      assert.equal(resourceId, question.get('id'), 'Question ids should match');
      return questionResult2;
    }
  });
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    classId: 'class-id',
    collectionId: 'collection-id',
    userId: 'user-id',
    isStudent: true
  });
  controller.set('onAir', true);

  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('collection', collection);
  controller.set('resourceResult', questionResult);
  controller.set('assessmentResult', assessmentResult);
  controller.set('context', context);
  controller.set('eventsService', Ember.Object.create({
    saveResourceResult: function(result, cont) {
      assert.ok(saveCounter < 2, 'saveResourceResult should be called twice');
      if(saveCounter < 1) {
        assert.deepEqual(result, questionResult, 'Wrong first result object');
        assert.equal(context.get('eventType'), 'stop', 'eventType updated');
      } else {
        assert.deepEqual(result, questionResult2, 'Wrong second result object');
        assert.equal(context.get('eventType'), 'start', 'eventType updated');
      }
      assert.deepEqual(cont, context, 'Wrong context object');
      saveCounter += 1;
      return Ember.RSVP.resolve();
    }
  }));
  controller.set('realTimeService', Ember.Object.create({
    notifyResourceResult: function(classId, collectionId, userId, result) {
      assert.deepEqual(result, questionResult, 'Wrong result object');
      assert.equal(classId, 'class-id', 'Wrong class id');
      assert.equal(collectionId, 'collection-id', 'Wrong collection id');
      assert.equal(userId, 'user-id', 'Wrong user id');
      return Ember.RSVP.resolve();
    }
  }));

  Ember.run(function() {
    controller.send('selectNavigatorItem', question);
  });

  assert.notOk(controller.get('showReport'), 'showReport updated');
  assert.deepEqual(controller.get('resource'), question, 'resource property updated');
  assert.deepEqual(controller.get('resourceId'), 'question-id', 'resourceId property updated');
  assert.deepEqual(controller.get('resourceResult'), questionResult2, 'resourceResult property updated');
});

test('changeEmotion', function(assert) {
  assert.expect(4);
  let controller = this.subject();
  let questionResult = QuestionResult.create(Ember.getOwner(this).ownerInjection());
  let context = Context.create(Ember.getOwner(this).ownerInjection(), {
    isStudent: true
  });
  let emotion = 'emotion';
  controller.set('resourceResult', questionResult);
  controller.set('context', context);
  controller.set('class', Ember.Object.create({
    isTeacher: function() {
      return false;
    }
  }));
  controller.set('eventsService', Ember.Object.create({
    saveReaction: function(result, cont) {
      assert.deepEqual(result, questionResult, 'Wrong first result object');
      assert.equal(questionResult.get('reaction'), 'emotion', 'reactionType updated');
      assert.deepEqual(cont, context, 'Wrong context object');
      assert.ok(context.get('isStudent'), 'isStudent updated');
      return Ember.RSVP.resolve();
    }
  }));

  controller.send('changeEmotion', emotion);
});
