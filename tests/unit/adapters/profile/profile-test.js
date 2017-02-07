import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:profile/profile', 'Unit | Adapter | profile/profile', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('readProfile', function(assert) {
  const adapter = this.subject();

  const routes = function() {
    this.get('/api/nucleus/v1/profiles/profile-id/demographics',
      () => [200, {'Content-Type': 'application/json'}, JSON.stringify({id:'77d0c04b-b71a-485b-9573-9101cc288a0f'})],
      false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  adapter.readProfile('profile-id')
    .then(response =>
      assert.deepEqual(response.id, '77d0c04b-b71a-485b-9573-9101cc288a0f', 'Wrong response')
    );
});
