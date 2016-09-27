import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';
import QuestionModel from 'gooru-web/models/content/question';

moduleForService('service:api-sdk/question', 'Unit | Service | api-sdk/question', {

});

test('createQuestion', function(assert) {
  const service = this.subject();
  let questionModel = Ember.Object.create();

  assert.expect(2);

  // There is not a Adapter stub in this case
  // Pretender was included because it is needed to simulate the response Headers including the Location value
  this.pretender.map(function() {
    this.post('/api/nucleus/v1/questions', function() {
      return [201, {'Content-Type': 'text/plain', 'Location': 'question-id'}, ''];
    }, false);
  });

  service.set('questionSerializer', Ember.Object.create({
    serializeCreateQuestion: function(questionObject) {
      assert.deepEqual(questionObject, questionModel, 'Wrong question object');
      return {};
    }
  }));

  var done = assert.async();
  service.createQuestion(questionModel)
    .then(function() {
      assert.equal(questionModel.get('id'), 'question-id', 'Wrong question id');
      done();
    });
});

test('readQuestion', function(assert) {
  const service = this.subject();
  assert.expect(2);

  service.set('questionAdapter', Ember.Object.create({
    readQuestion: function(questionId) {
      assert.equal(1, questionId, "readQuestion() function was called" );
      return Ember.RSVP.resolve({ id: questionId });
    }
  }));

  service.set('questionSerializer', Ember.Object.create({
    normalizeReadQuestion: function(questionData) {
      assert.deepEqual({ id: 1 }, questionData, 'Wrong question data');
      return {};
    }
  }));

  var done = assert.async();
  service.readQuestion(1).then(function() { done(); });
});

test('updateQuestion', function(assert) {
  const service = this.subject();
  const expectedQuestionId = 'question-id';
  const expectedQuestionModel = QuestionModel.create({ title: 'Question title' });

  assert.expect(2);

  service.set('questionAdapter', Ember.Object.create({
    updateQuestion: function(questionId) {
      assert.equal(questionId, expectedQuestionId, "Wrong question id" );
      return Ember.RSVP.resolve();
    }
  }));

  service.set('questionSerializer', Ember.Object.create({
    serializeUpdateQuestion: function(questionObject) {
      assert.deepEqual(questionObject, expectedQuestionModel, 'Wrong question object');
      return {};
    }
  }));

  var done = assert.async();
  service.updateQuestion(expectedQuestionId, expectedQuestionModel).then(function() { done(); });
});

test('deleteQuestion', function(assert) {
  const expectedQuestionId = 'question-id';
  const service = this.subject();

  assert.expect(1);

  service.set('questionAdapter', Ember.Object.create({
    deleteQuestion: function(questionId) {
      assert.equal(questionId, expectedQuestionId, 'Wrong question id');
      return Ember.RSVP.resolve();
    }
  }));

  var done = assert.async();
  service.deleteQuestion('question-id')
    .then(function() {
      done();
    });
});

test('copyQuestion', function(assert) {
  const service = this.subject();

  assert.expect(1);

  // There is not a Adapter stub in this case
  // Pretender was included because it is needed to simulate the response Headers including the Location value
  this.pretender.map(function() {
    this.post('/api/nucleus/v1/copier/questions/question-id', function() {
      return [201, {'Content-Type': 'text/plain', 'Location': 'copy-question-id'}, ''];
    }, false);
  });

  var done = assert.async();
  service.copyQuestion('question-id')
    .then(function(response) {
      assert.equal(response, 'copy-question-id', 'Wrong question id');
      done();
    });
});
