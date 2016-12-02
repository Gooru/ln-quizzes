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
      disconnect: function(channel, callback) {
        assert.ok(true, 'Disconnect should be called');
      }
    }
  }
  let stompStub = sinon.stub(Stomp, 'over')
    .onFirstCall().returns(createSocket())
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
  assert.expect(4);
  let expectedUrl = 'realtimeURL/realtimeURI';
  let connectTimes = 0;
  let createSocket = () => {
    return {
      heartbeat: {},
      connect: function(headers, connectCallback) {
        assert.ok(true, 'Connect should be called');
        connectCallback();
      },
      subscribe: function(channel, callback) {
        assert.equal(channel, '/context-simple-id', 'Channel should match.');
        /*callback({
          currentResourceId: 'current-resource',
          profileId: 'profile-id-2'
          events: [{
            resourceId: 'current-resource',
            timeSpent: 100,
            reaction: 3,
            answer: 'answer',
            score: 100
          }]
        });*/
      }
    }
  };
  let stompStub = sinon.stub(Stomp, 'over')
    .onFirstCall().returns(createSocket());
  SockJS = url => assert.equal(url, expectedUrl, 'URL should match');
  visit('/reports/context/context-simple-id');

  let done = assert.async();
  andThen(function() {
    assert.equal(currentURL(), '/reports/context/context-simple-id');
    done();
  });
});
