import Ember from 'ember';
import TokenMixin from 'quizzes-addon/mixins/token';
import { moduleFor, test } from 'ember-qunit';

moduleFor('mixin:token', 'Unit | Mixin | token', {
  beforeEach: function () {
    let token = 'my-token';
    this.register('service:quizzes/configuration', Ember.Object.extend({
      configuration: {
        properties: { token }
      }
    }));
  }
});

test('token', function(assert) {
  let token = 'my-token';
  let TokenObject = Ember.Object.extend(TokenMixin);
  this.registry.register('test:subject', TokenObject);
  const subject = this.container.lookup('test:subject');
  assert.equal(subject.get('token'), token);
});

test('headers', function(assert) {
  const expectedHeaders = {
    'Authorization': 'Token my-token'
  };
  let TokenObject = Ember.Object.extend(TokenMixin);
  this.registry.register('test:subject', TokenObject);
  const subject = this.container.lookup('test:subject');
  assert.deepEqual(subject.get('headers'), expectedHeaders);
});
