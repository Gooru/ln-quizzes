import { test } from 'ember-qunit';
import moduleForService from 'gooru-web/tests/helpers/module-for-service';

moduleForService('service:api-sdk/user', 'Unit | Service | api-sdk/user', {
  needs: ['serializer:user/user', 'model:user/user', 'adapter:user/user']
});

test('findMembersByClass', function (assert) {
  const service = this.subject();

  const
    response = {
      'searchResult': [{
        'associationDate': 1448412441000,
        'lastname': 'Bermudez',
        'emailId': 'jeffreystudent02@test.com',
        'username': 'JeffreyStudent02',
        'firstname': 'Jeffrey',
        'gooruUId': '7c74a27d-3748-49bd-83b4-4a3523ff370a'
      }],
      'totalHitCount': 1
    },
    routes = function () {
      this.get('/gooruapi/rest/v3/class/67a96ec1-7383-4164-8068-5415621b7a34/member', function () {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
      }, 0);
    };

  this.pretender.map(routes);

  var done = assert.async();
  const promise = service.findMembersByClass('67a96ec1-7383-4164-8068-5415621b7a34');
  promise.then(function (members) {
    assert.equal(members.get('length'), 1, 'Missing students');
    const member = members.get('firstObject');
    assert.equal(member.get('id'), '7c74a27d-3748-49bd-83b4-4a3523ff370a', 'Wrong id');
    assert.equal(member.get('username'), 'JeffreyStudent02', 'Wrong username');
    assert.equal(member.get('firstName'), 'Jeffrey', 'Wrong firstname');
    assert.equal(member.get('lastName'), 'Bermudez', 'Wrong lastname');
    assert.equal(member.get('email'), 'jeffreystudent02@test.com', 'Wrong email');
    done();
  });
});
