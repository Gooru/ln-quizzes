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
   * Normalize the resource data into a Resource object
   * @param resourceData
   * @returns {Resource}
   */
  normalizeReadResource: function(resourceData) {
    const serializer = this;
    const questionData = resourceData.metadata;
    const interaction = questionData.interaction;

    const resource = ResourceModel.create(Ember.getOwner(this).ownerInjection(), {
      id: resourceData.id,
      isResource: resourceData.isResource,
      sequence: resourceData.sequence,
      body: questionData.url || questionData.body,
      description: questionData.description,
      correctAnswer: questionData.correctAnswer,
      title: questionData.title,
      thumbnail: questionData.thumbnail,
      displayGuide: questionData['display_guide']&& (questionData['display_guide'].is_broken ===1 || questionData['display_guide'].is_frame_breaker ===1),
      type: questionData.type
    });

    resource.set('displayGuide', resource.get('displayGuide') || this.checkURLProtocol(resource.body));

    if(interaction){
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
  checkURLProtocol: function(url){
    return (window.location.protocol === 'https:'  && /^((http):\/\/)/.test(url));
  }
});
