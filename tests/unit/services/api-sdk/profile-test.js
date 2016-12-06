import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'quizzes/tests/helpers/module-for-service';

moduleForService('service:api-sdk/profile', 'Unit | Service | api-sdk/profile', {

});

test('readProfile', function(assert) {
  assert.expect(2);
  const service = this.subject();
  let expectedData = {
    firstName: 'first-name',
    id: 'profile-id',
    lastName: 'last-name',
    username: 'username',
    email: 'e@mail.com'
  };
  const expectedProfile = 'profile-id';

  service.set('profileAdapter', Ember.Object.create({
    readProfile: function(data) {
      assert.equal(data, expectedProfile, 'Wrong adapter data');
      return Ember.RSVP.resolve({});
    }
  }));
  service.set('profileSerializer', Ember.Object.create({
    normalizeProfile: function(profile) {
      assert.ok(profile, 'Wrong profile object');
      return expectedData;
    }
  }));

  let done = assert.async();
  service.readProfile('profile-id').then(function(response) {
    assert.deepEqual(response, expectedData, 'Wrong response');
    done();
  });
});
