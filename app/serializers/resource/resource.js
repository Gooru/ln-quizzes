import Ember from 'ember';
import ResourceModel from '../../models/resource/resource';
import AnswerModel from '../../models/resource/answer';

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
    const questionData = resourceData.questionData;
    const interaction = questionData.interaction;
    const resource = ResourceModel.create(Ember.getOwner(this).ownerInjection(), {
      id: resourceData.id,
      isResource: resourceData.isResource,
      sequence: resourceData.sequence,
      owner: resourceData.owner,
      body: questionData.body,
      correctAnswer: questionData.correctAnswer,
      title: questionData.title,
      type: questionData.type,
      answers: serializer.normalizeAnswers(interaction.choices),
      maxChoices: interaction.maxChoices,
      prompt: interaction.prompt,
      shuffle: interaction.shuffle
    });
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
      isFixed: choice.fixed,
      text: choice.text,
      value: choice.value
    });
  }
});
