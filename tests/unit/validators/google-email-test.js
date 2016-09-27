import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:google-email', 'Unit | Validator | google-email', {
  needs: ['validator:messages']
});

test('Email is not used in a google account', function(assert) {
  assert.expect(2);

  let validator =  this.subject();
  let done = assert.async();

  validator.set('profileService', Ember.Object.create({
    checkGoogleEmail: function(email) {
      assert.equal(email, 'email-value', 'Wrong email');
      return Ember.RSVP.resolve();
    }
  }));

  validator.validate('email-value').then((message) => {
    assert.equal(message, true);
    done();
  });
});

test('Email is used in a google account', function(assert) {
  assert.expect(2);

  let validator =  this.subject();
  let done = assert.async();

  const error = {
    message: 'error-message'
  };

  validator.set('profileService', Ember.Object.create({
    checkGoogleEmail: function(email) {
      assert.equal(email, 'email-value', 'Wrong email');
      return Ember.RSVP.reject(error);
    }
  }));

  validator.validate('email-value').then((message) => {
    assert.equal(message, error);
    done();
  });
});
