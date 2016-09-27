import Ember from 'ember';
import QuestionSerializer from 'gooru-web/serializers/content/question';
import QuestionAdapter from 'gooru-web/adapters/content/question';


/**
 * @typedef {Object} QuestionService
 */
export default Ember.Service.extend({

  /**
   * @property {QuestionSerializer} questionSerializer
   */
  questionSerializer: null,

  /**
   * @property {QuestionAdapter} questionAdapter
   */
  questionAdapter: null,

  init: function () {
    this._super(...arguments);
    this.set('questionSerializer', QuestionSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('questionAdapter', QuestionAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Creates a new question
   *
   * @param questionData object with the question data
   * @returns {Promise}
   */
  createQuestion: function(questionData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedClassData = service.get('questionSerializer').serializeCreateQuestion(questionData);
      service.get('questionAdapter').createQuestion({
        body: serializedClassData
      }).then(function(responseData, textStatus, request) {
        let questionId = request.getResponseHeader('location');
        questionData.set('id', questionId);
        resolve(questionData);
      }, reject);
    });
  },

  /**
   * Finds an questions by id
   * @param {string} questionId
   * @returns {Ember.RSVP.Promise}
   */
  readQuestion: function(questionId){
    const service = this;
    const serializer = service.get('questionSerializer');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('questionAdapter').readQuestion(questionId)
        .then(function(responseData /*, textStatus, request */) {
          resolve(serializer.normalizeReadQuestion(responseData));
        }, reject );
    });
  },

  /**
   * Updates a question
   *
   * @param questionId the id of the question to be updated
   * @param questionModel the question model with the data
   * @returns {Promise}
   */
  updateQuestion: function(questionId, questionModel) {
    const service = this;
    let serializedData = service.get('questionSerializer').serializeUpdateQuestion(questionModel);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('questionAdapter').updateQuestion(questionId, serializedData).then(resolve, reject);
    });
  },

  /**
   * Delete question
   *
   * @param questionId question id to delete
   * @returns {Ember.RSVP.Promise}
   */
  deleteQuestion: function (questionId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('questionAdapter').deleteQuestion(questionId)
        .then(resolve, reject);
    });
  },

  /**
   * Copies a question by id
   * @param {string} questionId
   * @returns {Ember.RSVP.Promise}
   */
  copyQuestion: function(questionId){
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('questionAdapter').copyQuestion(questionId)
        .then(function(responseData, textStatus, request) {
          resolve(request.getResponseHeader('location'));
        }, reject );
    });
  }

});
