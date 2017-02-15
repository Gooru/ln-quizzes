import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:profile/profile', 'Unit | Serializer | profile/profile');

test('normalizeProfile', function(assert) {
  const serializer = this.subject();
  const payload = {
    first_name: 'first-name',
    id: 'profile-id',
    last_name: 'last-name',
    username: 'username',
    email: 'e@mail.com'
  };
  const response = serializer.normalizeProfile(payload);

  assert.deepEqual(response.get('id'), 'profile-id', 'Wrong profile id');
  assert.deepEqual(response.get('firstName'), 'first-name', 'Wrong profile first name');
  assert.deepEqual(response.get('lastName'), 'last-name', 'Wrong profile last name');
  assert.deepEqual(response.get('username'), 'username', 'Wrong profile username');
  assert.deepEqual(response.get('email'), 'e@mail.com', 'Wrong profile email');
});

test('normalizeProfiles', function(assert) {
  const serializer = this.subject();
  const payload = {
    users: [{
      first_name: 'first-name',
      id: 'profile-id',
      last_name: 'last-name',
      username: 'username',
      email: 'e@mail.com'
    }]
  };
  const response = serializer.normalizeProfiles(payload);

  assert.deepEqual(response['profile-id'].get('id'), 'profile-id', 'Wrong profile id');
  assert.deepEqual(response['profile-id'].get('firstName'), 'first-name', 'Wrong profile first name');
  assert.deepEqual(response['profile-id'].get('lastName'), 'last-name', 'Wrong profile last name');
  assert.deepEqual(response['profile-id'].get('username'), 'username', 'Wrong profile username');
  assert.deepEqual(response['profile-id'].get('email'), 'e@mail.com', 'Wrong profile email');
});
