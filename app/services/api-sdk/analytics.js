import Ember from 'ember';
import PeerAdapter from 'gooru-web/adapters/analytics/peer';
import PeerSerializer from 'gooru-web/serializers/analytics/peer';
import CurrentLocationAdapter from 'gooru-web/adapters/analytics/current-location';
import CurrentLocationSerializer from 'gooru-web/serializers/analytics/current-location';

export default Ember.Service.extend({

  peerAdapter: null,

  peerSerializer: null,

  currentLocationAdapter: null,

  currentLocationSerializer: null,


  init: function() {
    this._super(...arguments);
    this.set('peerAdapter', PeerAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('peerSerializer', PeerSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('currentLocationAdapter', CurrentLocationAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('currentLocationSerializer', CurrentLocationSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  getCoursePeers: function(classId, courseId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('peerAdapter').getCoursePeers(classId, courseId)
        .then(function(response) {
          resolve(service.get('peerSerializer').normalizePeers(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  getUnitPeers: function(classId, courseId, unitId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('peerAdapter').getUnitPeers(classId, courseId, unitId)
        .then(function(response) {
          resolve(service.get('peerSerializer').normalizePeers(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  getLessonPeers: function(classId, courseId, unitId, lessonId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('peerAdapter').getLessonPeers(classId, courseId, unitId, lessonId)
        .then(function(response) {
          resolve(service.get('peerSerializer').normalizePeers(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  findResourcesByCollection: function(classId, courseId, unitId, lessonId, collectionId, collectionType) {
    const service = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      service.get('analyticsAdapter').queryRecord({
        classId: classId,
        courseId: courseId,
        unitId: unitId,
        lessonId: lessonId,
        collectionId: collectionId,
        collectionType: collectionType
      }).then(function(events) {
        resolve(service.get('analyticsSerializer').normalizeResponse(events));
      }, function(error) {
        reject(error);
      });
    });
  },

  getUserCurrentLocation: function(classId, userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('currentLocationAdapter').getUserCurrentLocation(classId, userId)
        .then(function(response) {
          resolve(service.get('currentLocationSerializer').normalizeCurrentLocation(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  getStandardsSummary: function(sessionId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('analyticsAdapter').getStandardsSummary(sessionId)
        .then(function(response) {
          resolve(service.get('analyticsSerializer').normalizeGetStandardsSummary(response));
        }, function(error) {
          reject(error);
        });
    });
  }

});
