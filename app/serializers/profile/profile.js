import Ember from 'ember';
import ProfileModel from 'gooru-web/models/profile/profile';
import Env from 'gooru-web/config/environment';
import ResourceModel from 'gooru-web/models/content/resource';
import AssessmentModel from 'gooru-web/models/content/assessment';
import QuestionModel from 'gooru-web/models/content/question';
import CollectionModel from 'gooru-web/models/content/collection';
import { NETWORK_TYPE, DEFAULT_IMAGES } from 'gooru-web/config/config';
import { cleanFilename } from 'gooru-web/utils/utils';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';

/**
 * Serializer to support the Profile CRUD operations for API 3.0
 *
 * @typedef {Object} ProfileSerializer
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('taxonomySerializer', TaxonomySerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Serialize a Profile object into a JSON representation required by the Create Profile endpoint
   * @param profileData the profile object
   * @returns {Object} returns a JSON Object
   */
  serializeCreateProfile: function(profileData) {
    return {
      firstname: profileData.get('firstName'),
      lastname: profileData.get('lastName'),
      username: profileData.get('username'),
      'email_id': profileData.get('email'),
      password: profileData.get('password'),
      'birth_date': profileData.get('dateOfBirth'),
      'user_category': profileData.get('role'),
      gender: null,
      grade: []
    };
  },

  /**
   * Serialize a Profile object into a JSON representation required by the Update Profile endpoint
   * @param profile
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateProfile: function(profile) {
    var profileObject = {
      firstname: profile.get('firstName'),
      lastname: profile.get('lastName'),
      'roster_global_userid':profile.get('studentId'),
      'user_category': profile.get('role'),
      username:profile.get('username'),
      grade: profile.get('grades'),
      country: profile.get('country'),
      'about_me': profile.get('aboutMe'),
      'country_id': profile.get('countryId'),
      'state_id': profile.get('stateId'),
      'school_district_id': profile.get('schoolDistrictId'),
      'thumbnail_path': cleanFilename(profile.get('avatarUrl'), this.get('session.cdnUrls'))
    };

    if(profile.get('state') && profile.get('state')!==''){
      profileObject["state"] = profile.get('state');
    }

    if(profile.get('schoolDistrict') && profile.get('schoolDistrict')!==''){
      profileObject["school_district"] = profile.get('schoolDistrict');
    }

    return profileObject;
  },

  normalizeCreateProfile: function(payload) {
    return {
      token: Env['API-3.0']['user-token-api-2.0'],
      'token-api3': payload['access_token'],
      user: {
        username: payload.username,
        gooruUId: payload['user_id'],
        isNew: true,
        avatarUrl: DEFAULT_IMAGES.USER_PROFILE
      },
      isAnonymous: false
    };
  },

  /**
   * Normalize the Read Profile endpoint response
   * @param payload is the endpoint response in JSON format
   * @returns {ProfileModel} a profile model object
   */
  normalizeReadProfile: function(payload) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.user');
    const thumbnailUrl = payload['thumbnail_path'] ?
      basePath + payload['thumbnail_path'] : DEFAULT_IMAGES.USER_PROFILE;

    return ProfileModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.id,
      firstName: payload.firstname,
      lastName: payload.lastname,
      username: payload.username,
      email: payload['email_id'],
      gender: payload.gender,
      grades: payload.grade,
      dateOfBirth: payload['birth_date'],
      role: payload['user_category'],
      createdAt: payload['created_at'],
      lastUpdate: payload['updated_at'],
      countryId: payload['country_id'],
      country: payload.country,
      stateId: payload['state_id'],
      state: payload.state,
      studentId:payload.roster_global_userid,
      schoolDistrictId: payload['school_district_id'],
      schoolDistrict: payload['school_district'],
      aboutMe: payload['about_me'],
      avatarUrl: thumbnailUrl,
      rosterId: payload['roster_id'],
      followers: payload.followers,
      followings: payload.followings,
      isFollowing: !!payload.isFollowing
    });
  },

  /**
   * Normalize the resources
   * @param payload
   * @returns {Resource[]}
   */
  normalizeReadResources: function(payload){
    const resources = payload.resources || [];
    const serializer = this;
    const owners = serializer.normalizeOwners(payload.owner_details || []);

    return resources.map(function(resourceData){
      return serializer.normalizeResource(resourceData, owners);
    });
  },

  /**
   * Normalize the questions
   * @param payload
   * @returns {Question[]}
   */
  normalizeReadQuestions: function(payload){
    const questions = payload.questions || [];
    const serializer = this;
    const owners = serializer.normalizeOwners(payload.owner_details || []);

    return questions.map(function(questionData){
      return serializer.normalizeQuestion(questionData, owners);
    });
  },

  /**
   * Normalize the collections
   * @param payload
   * @returns {Collection[]}
   */
  normalizeReadCollections: function(payload){
    const collections = payload.collections || [];
    const serializer = this;
    const owners = serializer.normalizeOwners(payload.owner_details || []);

    return collections.map(function(collectionData){
      return serializer.normalizeCollection(collectionData, owners);
    });
  },

  /**
   * Normalize the assessments
   * @param payload
   * @returns {Assessment[]}
   */
  normalizeReadAssessments: function(payload){
    const assessments = payload.assessments || [];
    const serializer = this;
    const owners = serializer.normalizeOwners(payload.owner_details || []);

    return assessments.map(function(assessmentData){
      return serializer.normalizeAssessment(assessmentData, owners);
    });
  },

  /**
   * Normalizes a resource
   * @param {Object} resourceData
   * @param {[]} owners
   * @returns {Resource}
   */
  normalizeResource: function (resourceData, owners) {
    const serializer = this;
    const format = ResourceModel.normalizeResourceFormat(resourceData.content_subformat);
    const standards = resourceData.taxonomy || [];
    const creatorId = resourceData.creator_id;
    const filteredOwners = Ember.A(owners).filterBy("id", creatorId);
    return ResourceModel.create(Ember.getOwner(this).ownerInjection(), {
      id: resourceData.id,
      title: resourceData.title,
      description: resourceData.description,
      url: resourceData.url,
      format: format,
      publishStatus: resourceData.publish_status,
      standards: serializer.get('taxonomySerializer').normalizeTaxonomyObject(standards),
      owner: filteredOwners.get("length") ? filteredOwners.get("firstObject") : null,
      isVisibleOnProfile: typeof resourceData.visible_on_profile !== 'undefined' ? resourceData.visible_on_profile : true
    });
  },

  /**
   * Normalizes a question
   * @param {Object} questionData
   * @param {[]} owners
   * @returns {Question}
   */
  normalizeQuestion: function (questionData, owners) {
    const serializer = this;
    const creatorId = questionData.creator_id;
    const filteredOwners = Ember.A(owners).filterBy("id", creatorId);
    const standards = questionData.taxonomy || [];
    const format = QuestionModel.normalizeQuestionType(questionData.content_subformat);
    return QuestionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: questionData.id,
      title: questionData.title,
      text: questionData.description,
      format: questionData.content_format,
      type:format,
      publishStatus: questionData.publish_status,
      standards: serializer.get('taxonomySerializer').normalizeTaxonomyObject(standards),
      owner: filteredOwners.get("length") ? filteredOwners.get("firstObject") : null,
      isVisibleOnProfile: typeof questionData.visible_on_profile !== 'undefined' ? questionData.visible_on_profile : true
    });
  },

  /**
   * Normalizes a collection
   * @param {Object} collectionData
   * @param {[]} owners
   * @returns {Collection}
   */
  normalizeCollection: function (collectionData, owners) {
    const serializer = this;
    const ownerId = collectionData.owner_id;
    const filteredOwners = Ember.A(owners).filterBy("id", ownerId);
    const standards = serializer.get('taxonomySerializer').normalizeTaxonomyObject(collectionData.taxonomy || []);
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnailUrl = collectionData.thumbnail ?
      basePath + collectionData.thumbnail : DEFAULT_IMAGES.COLLECTION;

    return CollectionModel.create(Ember.getOwner(serializer).ownerInjection(), {
      id: collectionData.id,
      title: collectionData.title,
      standards: standards,
      thumbnailUrl: thumbnailUrl,
      publishStatus: collectionData.publish_status,
      learningObjectives: collectionData.learning_objective,
      originalCreatorId: collectionData.original_creator_id,
      resourceCount: collectionData.resource_count,
      questionCount: collectionData.question_count,
      remixCount: collectionData.remix_count, //TODO missing on API
      course: collectionData.course ? collectionData.course.title : null,
      courseId: collectionData.course ? collectionData.course.id : null,
      isVisibleOnProfile: typeof collectionData.visible_on_profile !== 'undefined' ? collectionData.visible_on_profile : true,
      owner: filteredOwners.get("length") ? filteredOwners.get("firstObject") : null
    });
  },

  /**
   * Normalizes a assessment
   * @param {Object} assessmentData
   * @param {[]} owners
   * @returns {Assessment}
   */
  normalizeAssessment: function (assessmentData, owners) {
    const serializer = this;
    const ownerId = assessmentData.owner_id;
    const filteredOwners = Ember.A(owners).filterBy("id", ownerId);
    const standards = serializer.get('taxonomySerializer').normalizeTaxonomyObject(assessmentData.taxonomy || []);
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnailUrl = assessmentData.thumbnail ?
      basePath + assessmentData.thumbnail : DEFAULT_IMAGES.ASSESSMENT;

    return AssessmentModel.create(Ember.getOwner(serializer).ownerInjection(), {
      id: assessmentData.id,
      title: assessmentData.title,
      thumbnailUrl: thumbnailUrl,
      standards: standards,
      publishStatus: assessmentData.publish_status,
      originalCreatorId: assessmentData.original_creator_id,
      learningObjectives: assessmentData.learning_objective,
      questionCount: assessmentData.question_count,
      remixCount: assessmentData.remix_count, //TODO missing on API
      course: assessmentData.course ? assessmentData.course.title : null,
      courseId: assessmentData.course ? assessmentData.course.id : null,
      isVisibleOnProfile: typeof assessmentData.visible_on_profile !== 'undefined' ? assessmentData.visible_on_profile : true,
      owner: filteredOwners.get("length") ? filteredOwners.get("firstObject") : null,
      format: assessmentData.format,
      url: assessmentData.url
    });
  },

  /**
   * Normalizes owners
   * @param payload
   * @returns {Content/User}
   */
  normalizeOwners: function (payload) {
    const serializer = this;
    return payload.map(function(ownerData){
      return serializer.normalizeReadProfile(ownerData);
    });
  },

  /**
   * Normalize the network details list
   * @param payload
   * @returns {Collection[]}
   */
  normalizeReadNetwork: function(payload, type) {
    const serializer = this;
    const details = payload.details || [];
    const following = payload.followings || [];

    return details.map(function(networkData){
      return serializer.normalizeNetworkDetail(networkData, type, following);
    });
  },

  normalizeNetworkDetail: function(networkData, type, following) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.user');
    const thumbnailUrl = networkData['thumbnail_path'] ?
    basePath + networkData['thumbnail_path'] : DEFAULT_IMAGES.USER_PROFILE;

    return ProfileModel.create(Ember.getOwner(this).ownerInjection(), {
      "id": networkData.id,
      "firstName": networkData.firstname,
      "lastName": networkData.lastname,
      "avatarUrl": thumbnailUrl,
      "country": networkData.country,
      "schoolDistrict": networkData.school_district,
      "followers": networkData.followers_count,
      "followings": networkData.followings_count,
      "isFollowing": type === NETWORK_TYPE.FOLLOWERS ? following.indexOf(networkData.id) > -1 : true
    });
  },

  normalizeReadMultipleProfiles: function(payload) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.user');
    let profiles = Ember.A([]);
    if (payload.users) {
      profiles = payload.users.map(function(userPayload) {
        return ProfileModel.create({
          id: userPayload.id,
          firstName: userPayload.firstname,
          lastName: userPayload.lastname,
          username: userPayload.username,
          avatarUrl: userPayload['thumbnail_path'] ? basePath + userPayload['thumbnail_path'] : DEFAULT_IMAGES.USER_PROFILE
        });
      });
    }
    return profiles;
  }
});
