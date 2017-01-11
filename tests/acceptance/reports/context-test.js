/*global SockJS:true*/
import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | reports/context', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'token-value',
      user: {
        providedAt: Date.now()
      }
    });
  },
  afterEach: function() {
    Stomp.over.restore();
  }
});

test('Report context: websocket error', function(assert) {
  assert.expect(7);
  let expectedUrl = 'realtimeURL/realtimeURI';
  let connectTimes = 0;
  let createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback, errorCallback) {
        assert.ok(true, 'Connect should be called');
        if(!connectTimes) {
          assert.deepEqual(headers, {}, 'Headers should match');
          errorCallback();
        }
        connectTimes += 1;
      },
      disconnect: function() {
        assert.ok(true, 'Disconnect should be called');
      }
    };
  };
  sinon.stub(Stomp, 'over').onFirstCall().returns(createSocket())
    .onSecondCall().returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-id');

  let done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-id');
    setTimeout(done, 5000);
  });
});

test('Report context: websocket success', function(assert) {
  assert.expect(7);
  let expectedUrl = 'realtimeURL/realtimeURI';
  let createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel) {
        assert.equal(channel, '/topic/context-simple-id', 'Channel should match.');
      }
    };
  };
  sinon.stub(Stomp, 'over').onFirstCall().returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  let done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    assert.equal(Ember.$('.gru-student-performance-box').length, 2, 'Should show 2 students');
    assert.ok(Ember.$('.gru-student-performance-box:first .score').text().indexOf('50%') > -1, 'Score for student 1 shows correctly');
    assert.ok(Ember.$('.gru-student-performance-box:last .score').text().indexOf('50%') > -1, 'Score for student 2 shows correctly');
    done();
  });
});

test('Report context: websocket start message', function(assert) {
  assert.expect(7);
  let expectedUrl = 'realtimeURL/realtimeURI';
  let createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel, callback) {
        assert.equal(channel, '/topic/context-simple-id', 'Channel should match.');
        callback({
          body: `{
           "contextId": "context-simple-id",
           "profileId": "new-profile-id",
           "eventName": "startContextEvent",
           "eventBody": {
             "isNewAttempt": true,
             "currentResourceId": "current-resource"
            }
          }`
        });
      }
    };
  };
  sinon.stub(Stomp, 'over').onFirstCall().returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  let done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    assert.equal(Ember.$('.gru-student-performance-box').length, 3, 'Should show 3 students');
    assert.ok(Ember.$('.gru-student-performance-box:first .score').text().indexOf('50%') > -1, 'Score for student 1 shows correctly');
    assert.ok(Ember.$('.gru-student-performance-box:last .score').text().indexOf('0%') > -1, 'Score for student 2 shows correctly');
    done();
  });
});
