import Ember from 'ember';
import AssessmentResult from 'gooru-web/models/result/assessment';
import QuestionResult from 'gooru-web/models/result/question';
import ResourceResult from 'gooru-web/models/result/resource';
import { module, test } from 'qunit';

module('Unit | Model | result/assessment');


test('questionResults', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      ResourceResult.create(),
      ResourceResult.create(),
      QuestionResult.create()
    ])
  });

  assert.equal(assessmentResult.get("questionResults").get("length"), 1, "Wrong question results");
});

test('totalResources', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([1,2])
  });

  assert.equal(assessmentResult.get("totalResources"), 2, "Wrong total resources");
});

test('averageReaction', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      ResourceResult.create({ reaction: 5 }),
      ResourceResult.create({ reaction: 2 }),
      QuestionResult.create({ reaction: 2 })
    ])
  });

  assert.equal(assessmentResult.get("averageReaction"), 3, "Wrong average reaction");
});

test('correctPercentage', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      ResourceResult.create(),
      QuestionResult.create({ correct: false }),
      QuestionResult.create({ correct: true })
    ])
  });

  assert.equal(assessmentResult.get("correctPercentage"), 50, "Wrong correctPercentage");
});

test('totalTimeSpent', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      ResourceResult.create({ timeSpent: 5 }),
      QuestionResult.create({ timeSpent: 10 }),
      QuestionResult.create({ timeSpent: 20 })
    ])
  });

  assert.equal(assessmentResult.get("totalTimeSpent"), 35, "Wrong total time spent");
});

test('correctAnswers', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      ResourceResult.create(),
      QuestionResult.create({ correct: false }),
      QuestionResult.create({ correct: true })
    ])
  });

  assert.equal(assessmentResult.get("correctAnswers"), 1, "Wrong correctAnswers");
});

test('started', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "startedAt": new Date()
  });

  assert.ok(assessmentResult.get("started"), "Assessment result should be started");

  //when started at is not available
  assessmentResult.set("startedAt", null);
  assert.ok(!assessmentResult.get("started"), "Assessment result should not be started");
});

/*
test('submitted', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "submittedAt": new Date()
  });

  assert.ok(assessmentResult.get("submitted"), "Assessment result should be submitted");

  //when submitted at is not available
  assessmentResult.set("submittedAt", null);
  assert.ok(!assessmentResult.get("submitted"), "Assessment result should not be submitted");
});
*/

test('getResultByResourceId', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(assessmentResult.getResultByResourceId(1).get("resourceId"), 1, "Wrong result");
});

test('pendingQuestionResults', function(assert) {
  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      QuestionResult.create(), //not pending
      QuestionResult.create({ //not pending
        "startedAt": new Date(),
        "submittedAt": new Date()
      }),
      QuestionResult.create({ //pending
        "startedAt": new Date()
      }),
      ResourceResult.create({ //pending but ignored since these method returns only question results
        "startedAt": new Date()
      })
    ])
  });

  assert.equal(assessmentResult.get("pendingQuestionResults").get("length"), 1, "Wrong pending results");
});

test('merge with no results', function(assert) {
  let collection = Ember.Object.create({
    "resources" : Ember.A([
      Ember.Object.create({
        id: "1",
        isQuestion: false
      }),
      Ember.Object.create({
        id: "2",
        isQuestion: true
      })
    ])
  });

  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([]) //no results
  });

  assessmentResult.merge(collection);
  let resourceResults = assessmentResult.get("resourceResults");

  assert.ok(resourceResults.findBy("resource.id", "1"), "Resource 1 not found");
  assert.ok(resourceResults.findBy("resource.id", "2"), "Resource 2 not found");
});

test('merge with results', function(assert) {
  let collection = Ember.Object.create({
    "resources" : Ember.A([
      Ember.Object.create({
        id: "1",
        isQuestion: false
      }),
      Ember.Object.create({
        id: "2",
        isQuestion: true
      })
    ])
  });

  let assessmentResult = AssessmentResult.create({
    "resourceResults": Ember.A([
      Ember.Object.create({
        "resourceId": "1"
      })
    ])
  });

  assessmentResult.merge(collection);
  let resourceResults = assessmentResult.get("resourceResults");

  assert.ok(resourceResults.findBy("resource.id", "1"), "Resource 1 not found");
  assert.ok(resourceResults.findBy("resource.id", "2"), "Resource 2 not found");
});

