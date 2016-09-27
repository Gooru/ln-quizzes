import Ember from 'ember';
import DS from 'ember-data';

/**
 * Lesson serializer for Lesson model
 *
 * @typedef {Object} LessonSerializer
 */
export default DS.JSONAPISerializer.extend({

  /**
   * Normalize a queryRecord response
   * @param store
   * @param primaryModelClass
   * @param payload
   * @returns {Lesson|Lesson[]} Returns a Lesson or a Lesson array
   */
  normalizeQueryRecordResponse: function(store, primaryModelClass, payload) {
    const serializer = this;
    const  isMultipleResult = Ember.isArray(payload);
    if (isMultipleResult) {
      var model = { data: [] };
      Ember.$.each(payload, function(index, result){
        model.data.push(serializer.normalizeLesson(result));
      });
      return model;
    } else {
      return {
        data: this.normalizeLesson(payload)
      };
    }
  },

  normalizeLesson: function(payload) {
    return {
      id: payload.gooruOid,
      type: 'lesson/lesson',
      attributes: {
        title: payload.title,
        collection: payload.collectionId,
        visibility: payload.visibility ? payload.visibility : false
      }
    };
  }

});
