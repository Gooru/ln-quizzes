import Ember from 'ember';
import TokenMixin from 'quizzes/mixins/token';
import { module, test } from 'qunit';

module('Unit | Mixin | token');

test('token', function(assert) {
  let token = 'my-token';
  let TokenObject = Ember.Object.extend(TokenMixin);
  let subject = TokenObject.create({
    configurationService: {
      configuration: {
        properties: {
          token
        }
      }
    }
  });
  assert.equal(subject.get('token'), token);
});
