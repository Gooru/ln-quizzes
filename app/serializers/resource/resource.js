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
    const questionData = resourceData.metadata;
    const interaction = questionData.interaction;

    const resource = ResourceModel.create(Ember.getOwner(this).ownerInjection(), {
      id: resourceData.id,
      isResource: resourceData.isResource,
      sequence: resourceData.sequence,
      body: questionData.url || questionData.body,
      correctAnswer: questionData.correctAnswer,
      title: questionData.title,
      type: questionData.type
    });

    if(interaction){
      resource.setProperties({
        answers: serializer.normalizeAnswers(interaction.choices,questionData.type),
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
  normalizeAnswers: function(choices,type) {
    return Ember.isArray(choices)
      ? choices.map(answer => this.normalizeAnswer(answer,type))
      : [];
  },

  /**
   * Normalize the choice data into an answer object
   * @param choice object
   * @returns {Answer}
   */
  normalizeAnswer: function(choice,type) {
    let isHSImage = type === 'multiple_choice_image';
    return AnswerModel.create(Ember.getOwner(this).ownerInjection(), {
      isFixed: choice.isFixed,
      text: isHSImage ? localStorage.getItem('cdnURL') + choice.text : choice.text,
      value: choice.value
    });
  }
});
