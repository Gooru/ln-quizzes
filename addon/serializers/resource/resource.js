import Ember from 'ember';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import AnswerModel from 'quizzes-addon/models/resource/answer';

/**
 * Serializer for Resource
 *
 * @typedef {Object} ResourceSerializer
 */
export default Ember.Object.extend({

  /**
   * @property {Ember.Service} Service to session
   */
  session: Ember.inject.service('session'),

  /**
   * Assign the content CDN url from authenticated session object
   * @type {String}
   */
  contentCDNUrl: Ember.computed.alias('session.cdnUrls.content'),

  /**
   * Normalize the resource data into a Resource object
   * @param resourceData
   * @returns {Resource}
   */
  normalizeReadResource: function(resourceData) {
    const serializer = this;
    const questionData = resourceData.title || !resourceData.metadata ? resourceData : resourceData.metadata;
    const interaction = questionData ? questionData.interaction : null;
    const resource = ResourceModel.create(Ember.getOwner(this).ownerInjection(), {
      id: resourceData.id,
      isResource: resourceData.isResource,
      sequence: resourceData.sequence,
      body: questionData.url || questionData.body,
      description: questionData.description,
      correctAnswer: questionData.correctAnswer,
      narration:questionData.narration,
      ownerId:questionData.creator_id || questionData.ownerId,
      title: questionData.title,
      thumbnail: questionData.thumbnail,
      displayGuide: questionData.display_guide && (questionData.display_guide.is_broken === 1 ||
        questionData.display_guide.is_frame_breaker === 1),
      type: questionData.content_subformat || questionData.type,
      mediaUrl: (questionData.thumbnail ? (serializer.get('contentCDNUrl') + questionData.thumbnail) : null)
    });

    resource.set('displayGuide', resource.get('displayGuide') || this.checkURLProtocol(resource.body));

    if(interaction) {
      resource.setProperties({
        answers: serializer.normalizeAnswers(interaction.choices),
        maxChoices: interaction.maxChoices,
        prompt: interaction.prompt,
        shuffle: interaction.isShuffle
      });
    }
    return resource;
  },

  /**
   * Normalize the choices data into answers array
   * @param choices array
   * @returns {Answer[]}
   */
  normalizeAnswers: function(choices) {
    return Ember.isArray(choices)
      ? choices.map(answer => this.normalizeAnswer(answer))
      : [];
  },

  /**
   * Normalize the choice data into an answer object
   * @param choice object
   * @returns {Answer}
   */
  normalizeAnswer: function(choice) {
    return AnswerModel.create(Ember.getOwner(this).ownerInjection(), {
      isFixed: choice.isFixed,
      text: choice.text,
      value: choice.value
    });
  },

  /**
   * Check if the current location protocol matches
   * @param url
   * @returns {Boolean}
   */
  checkURLProtocol: function(url){
    return (window.location.protocol === 'https:'  && /^((http):\/\/)/.test(url));
  }
});
