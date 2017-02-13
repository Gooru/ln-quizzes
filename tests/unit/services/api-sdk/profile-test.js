import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/profile', 'Unit | Service | api-sdk/profile', {

});

test('readProfiles', function(assert) {
  assert.expect(3);
  const service = this.subject();
  let expectedData = {
    'profile-id1': {
      firstName: 'first-name',
      id: 'profile-id1',
      lastName: 'last-name',
      username: 'username',
      email: 'e@mail.com'
    },
    'profile-id2': {
      firstName: 'first-name',
      id: 'profile-id2',
      lastName: 'last-name',
      username: 'username',
      email: 'e@mail.com'
    }
  };
  const expectedProfiles = [ 'profile-id1', 'profile-id2' ];
  service.set('profileAdapter', Ember.Object.create({
    readProfiles: function(data) {
      assert.deepEqual(data, expectedProfiles, 'Wrong adapter data');
      return Ember.RSVP.resolve({});
    }
  }));
  service.set('profileSerializer', Ember.Object.create({
    normalizeProfiles: function(profile) {
      assert.ok(profile, 'Wrong profile object');
      return expectedData;
    }
  }));

  let done = assert.async();
  service.readProfiles(expectedProfiles).then(function(response) {
    assert.deepEqual(response, expectedData, 'Wrong response');
    done();
  });
});

test('readProfiles chunk size 1', function(assert) {
  assert.expect(1);
  const service = this.subject();
  let expectedData = {
    'profile-id1': {
      firstName: 'first-name',
      id: 'profile-id1',
      lastName: 'last-name',
      username: 'username',
      email: 'e@mail.com'
    },
    'profile-id2': {
      firstName: 'first-name',
      id: 'profile-id2',
      lastName: 'last-name',
      username: 'username',
      email: 'e@mail.com'
    }
  };
  const expectedProfiles = [ 'profile-id1', 'profile-id2' ];
  service.set('profileAdapter', Ember.Object.create({
    readProfiles: function(data) {
      return Ember.RSVP.resolve({
        users: data.map(id => expectedData[id])
      });
    }
  }));
  service.set('profileSerializer', Ember.Object.create({
    normalizeProfiles: function(profiles) {
      return profiles.users.reduce((profiles, profile) => {
        profiles[profile.id] = profile;
        return profiles;
      }, {});
    }
  }));

  let done = assert.async();
  service.readProfiles(expectedProfiles, 1).then(function(response) {
    assert.deepEqual(response, expectedData, 'Wrong response');
    done();
  });
});
