import Ember from 'ember';
import ResourceSerializer from 'quizzes-addon/serializers/resource/resource';
import CollectionModel from 'quizzes-addon/models/collection/collection';
import { ASSESSMENT_SHOW_VALUES } from 'quizzes-addon/config/quizzes-config';

/**
 * Serializer for Collection
 *
 * @typedef {Object} CollectionSerializer
 */
export default Ember.Object.extend({

  /**
   * @property {ResourceSerializer} resourceSerializer
   */
  resourceSerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('resourceSerializer', ResourceSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Normalize the Collection data into a Collection object
   * @param payload
   * @returns {Question}
   */
  normalizeReadCollection: function(payload) {
    const serializer = this;
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.id,
      isCollection: payload.isCollection,
      resources: serializer.normalizeResources(payload.resources),
      settings: !payload.isCollection && payload.metadata ? serializer.normalizeSettings(payload.metadata.setting) : null
    });
  },

  /**
   * Normalize the resources from a collection
   * @param payload
   * @returns {Resource}
   */
  normalizeResources: function(payload) {
    return Ember.isArray(payload)
      ? payload.map(resource => this.get('resourceSerializer').normalizeReadResource(resource))
      : [];
  },
  /**
   * Normalize the settings from a collection
   * @param setting
   * @returns {Object}
   */
  normalizeSettings: function(setting) {
    return {
      attempts: setting.attempts_allowed || -1,
      bidirectional: setting.bidirectional_play || false,
      showFeedback: setting.show_feedback || ASSESSMENT_SHOW_VALUES.SUMMARY,
      showKey: setting.show_key === ASSESSMENT_SHOW_VALUES.SUMMARY
    };
  }
});