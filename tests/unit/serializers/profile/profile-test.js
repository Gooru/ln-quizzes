import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:profile/profile', 'Unit | Serializer | profile/profile');

test('normalizeProfile', function(assert) {
  const serializer = this.subject();
  const payload = {
    firstName: 'first-name',
    id: 'profile-id',
    lastName: 'last-name',
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
