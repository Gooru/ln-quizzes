import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Profile from 'quizzes/models/profile/profile';
import Collection from 'quizzes/models/collection/collection';
import ReportData from 'quizzes/models/result/report-data';
import ReportDataEvent from 'quizzes/models/result/report-data-event';

moduleFor('route:reports/context', 'Unit | Route | reports/context', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('model', function(assert) {
  let route = this.subject();
  route.set('contextService', {
    getReportData: function() {
      return new Ember.RSVP.resolve(
        ReportData.create({
          id: 'context-id',
          collection: {
            id: 'collection-id'
          },
          reportEvents: [{
            profileId: 'profile1'
          }, {
            profileId: 'profile2'
          }]
        })
      );
    }
  });
  route.set('collectionService', {
    readCollection: function() {
      return new Ember.RSVP.resolve({
        id: 'collection-id'
      });
    }
  });
  route.set('profileService', {
    readProfile: function(profileId) {
      return new Ember.RSVP.resolve({
        id: profileId
      });
    }
  });
  let done = assert.async();
  route.model({ contextId: 'context-id'}).then(function(hash){
    assert.ok(hash.reportData, 'Report data is added to the model');
    assert.ok(hash.collection, 'Collection is added to the model');
    assert.ok(hash.profiles, 'Profiles object is added to the model');
    assert.equal(hash.collection.id, 'collection-id', 'Collection id should match');
    assert.equal(hash.profiles.profile1.id, 'profile1', 'Profile 1 id should match');
    assert.equal(hash.profiles.profile2.id, 'profile2', 'Profile 2 id should match');
    done();
  });
});

test('setupController', function(assert) {
  let route = this.subject();
  let controller = Ember.Object.create();
  let model = {
    reportData: ReportData.create({
      id: 'context-id',
      reportEvents: [
        ReportDataEvent.create({
          profileId: 'profile1'
        }),
        ReportDataEvent.create({
          profileId: 'profile2'
        })
      ]
    }),
    collection: Collection.create({
      id: 'collection-id'
    }),
    profiles: {
      profile1: Profile.create({
        id: 'profile1',
        firstName: 'first-name1',
        lastName: 'last-name1'
      }),
      profile2: Profile.create({
        id: 'profile2',
        firstName: 'first-name2',
        lastName: 'last-name2'
      })
    }
  };
  route.setupController(controller, model);
  assert.deepEqual(model.reportData.reportEvents[0].profileName, 'first-name1 last-name1', 'Profile 1 name should match');
  //assert.deepEqual(model.reportData.reportEvents[0].profileCode, 'code1', 'Profile 1 code should match');
  assert.deepEqual(model.reportData.reportEvents[1].profileName, 'first-name2 last-name2', 'Profile 2 name should match');
  //assert.deepEqual(model.reportData.reportEvents[0].profileCode, 'code2', 'Profile 2 code should match');
  assert.deepEqual(model.reportData.collection, model.collection, 'Report data collection should be set');
  assert.deepEqual(controller.reportData, model.reportData, 'Report data should be set in the controller');
});
