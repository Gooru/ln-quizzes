import Ember from 'ember';
import Lesson from 'gooru-web/models/content/lesson';
import LessonItem from 'gooru-web/models/content/lessonItem';
import { DEFAULT_IMAGES } from "gooru-web/config/config";

/**
 * Serializer to support the Lesson CRUD operations
 *
 * @typedef {Object} LessonSerializer
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  /**
   * Serialize a Content/Lesson object into a JSON representation required by the Create Lesson endpoint
   *
   * @param lessonModel - The lesson model to be serialized
   * @returns {Object} JSON Object representation of the lesson model
   */
  serializeCreateLesson: function (lessonModel) {
    var lessonData =  this.get('serializeUpdateLesson')(lessonModel);
    return lessonData;
  },

  /**
   * Serialize a Content/Lesson object into a JSON representation required by the Update Lesson endpoint
   *
   * @param lessonModel - The lesson model to be serialized
   * @returns {Object} JSON Object representation of the lesson model
   */
  serializeUpdateLesson: function (lessonModel) {
    return {
      title: lessonModel.get('title'),
      taxonomy: []   // TODO: pending
    };
  },

  /**
   * Normalize a lesson response
   * @param lessonData - The endpoint response in JSON format
   * @returns {Content/Lesson} lesson model
   */
  normalizeLesson: function (lessonData) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    return Lesson.create(Ember.getOwner(this).ownerInjection(), {
      children: function () {
        var lessonItems = [];

        if (lessonData.collection_summary) {
          lessonItems = lessonData.collection_summary.map(function (lessonItemData) {
            const lessonItem  = LessonItem.create({
              id: lessonItemData.id,
              format: lessonItemData.format,
              url: lessonItemData.url,
              questionCount: lessonItemData.question_count ? lessonItemData.question_count : 0,
              resourceCount: lessonItemData.resource_count ? lessonItemData.resource_count : 0,
              sequence: lessonItemData.sequence_id,
              title: lessonItemData.title
            });

            const defaultImage = (lessonItem.get("isCollection")) ? DEFAULT_IMAGES.COLLECTION : DEFAULT_IMAGES.ASSESSMENT;
            const thumbnailUrl = lessonItemData.thumbnail ? basePath + lessonItemData.thumbnail : defaultImage;
            lessonItem.set("thumbnailUrl", thumbnailUrl);

            return lessonItem;
          });
        }
        return Ember.A(lessonItems);
      }(),
      id: lessonData.lesson_id,
      sequence: lessonData.sequence_id,
      title: lessonData.title,
      taxonomy: lessonData.taxonomy ? lessonData.taxonomy.slice(0) : []
    });
  },

  /**
   * Serialize reorder lesson
   * @param {string[]} collectionIds
   */
  serializeReorderLesson: function (collectionIds) {
    const values = collectionIds.map(function(id, index) {
      return { "id" : id, "sequence_id" : index + 1 };
    });

    return {
      "order": values
    };
  }


});
