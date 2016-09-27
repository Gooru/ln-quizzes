import Ember from 'ember';
import { cleanFilename } from 'gooru-web/utils/utils';
import CourseModel from 'gooru-web/models/content/course';
import UnitSerializer from 'gooru-web/serializers/content/unit';
import ProfileSerializer from 'gooru-web/serializers/profile/profile';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';
import { DEFAULT_IMAGES, TAXONOMY_LEVELS } from "gooru-web/config/config";

/**
 * Serializer to support the Course CRUD operations for API 3.0
 *
 * @typedef {Object} CourseSerializer
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  unitSerializer: null,

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('unitSerializer', UnitSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('profileSerializer', ProfileSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('taxonomySerializer', TaxonomySerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Serialize a Course object into a JSON representation required by the Create Course endpoint
   *
   * @param courseModel The Course model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeCreateCourse: function(courseModel) {
    var courseData = this.serializeCourse(courseModel);
    return courseData;
  },

  /**
   * Serialize a Course object into a JSON representation required by the Create Edit endpoint
   *
   * @param courseModel The Course model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateCourse: function (courseModel,updateAll) {
    var courseData;
    if(updateAll){
      courseData = this.serializeCourse(courseModel);
    }else{
      courseData = {
        title: courseModel.get('title')
      };
    }
    return courseData;
  },

  serializeCourse: function(courseModel) {
    const serializer = this;
    let serializedCourse = {
      title: courseModel.get('title'),
      description: courseModel.get('description'),
      thumbnail: cleanFilename(courseModel.get('thumbnailUrl'), this.get('session.cdnUrls')),
      'visible_on_profile': courseModel.get('isVisibleOnProfile'),
      taxonomy: serializer.get('taxonomySerializer').serializeTaxonomy(courseModel.get('taxonomy')),
      'subject_bucket': courseModel.get('subject'),
      'metadata': courseModel.get('metadata') || {},
      'use_case': courseModel.get('useCase')
    };

    serializedCourse.metadata['audience']= (courseModel.get("audience")) ? courseModel.get("audience") : [];
    return serializedCourse;
  },

  /**
   * Normalize an array of courses
   *
   * @param payload endpoint response format in JSON format
   * @returns {Content/Course[]} courseData - An array of course models
   */
  normalizeGetCourses: function(payload) {
    const serializer = this;
    if (payload.courses && Ember.isArray(payload.courses)) {
      const owners = Ember.A(payload.owner_details || []);
      return payload.courses.map(function(course) {
        return serializer.normalizeCourse(course, owners);
      });
    } else {
      return [];
    }
  },

  /**
   * Normalize a Course response
   *
   * @param payload - The endpoint response in JSON format
   * @param {[]} owners owner details
   * @returns {Content/Course} Course Model
   */
  normalizeCourse: function(payload, owners) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnailUrl = payload.thumbnail ? basePath + payload.thumbnail : DEFAULT_IMAGES.COURSE;
    const owner = owners ? owners.findBy("id", payload.owner_id) : null;
    const metadata = payload.metadata || {};

    return CourseModel.create(Ember.getOwner(serializer).ownerInjection(), {
      id: payload.id,
      collaborator: payload.collaborator ? payload.collaborator : [],
      creatorId: payload.creator_id,
      originalCourseId: payload.original_course_id,
      originalCreatorId: payload.original_creator_id,
      children: serializer.get('unitSerializer').normalizeUnits(payload.unit_summary),
      description: payload.description,
      isPublished: payload['publish_status'] && payload['publish_status'] === 'published',
      isVisibleOnProfile: typeof payload['visible_on_profile'] !== 'undefined' ? payload['visible_on_profile'] : true,
      owner: owner ? serializer.get("profileSerializer").normalizeReadProfile(owner): null,
      subject: payload.subject_bucket,
      taxonomy: serializer.get('taxonomySerializer').normalizeTaxonomyObject(payload.taxonomy, TAXONOMY_LEVELS.COURSE),
      thumbnailUrl: thumbnailUrl,
      title: payload.title,
      unitCount: payload.unit_count ? payload.unit_count : payload.unit_summary ? payload.unit_summary.length : 0,
      metadata: metadata,
      audience: metadata["audience"] && metadata["audience"].length > 0 ? metadata["audience"] : [],
      useCase: payload.use_case
      // TODO More properties will be added here...
    });
  },

  /**
   * Serialize reorder course
   * @param {string[]} unitIds
   */
  serializeReorderCourse: function (unitIds) {
    const values = unitIds.map(function(id, index) {
      return { "id" : id, "sequence_id" : index + 1 };
    });

    return {
      "order": values
    };
  }


});
