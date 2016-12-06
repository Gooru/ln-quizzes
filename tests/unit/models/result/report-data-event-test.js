import Ember from 'ember';
import QuestionResult from 'quizzes/models/result/question';
import ResourceResult from 'quizzes/models/result/resource';
import Profile from 'quizzes/models/profile/profile';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/report-data-event', 'Unit | Model | result/report-data-event');

test('questionResults', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create(),
      ResourceResult.create(),
      QuestionResult.create()
    ])
  });

  assert.equal(contextResult.get('questionResults').get('length'), 1, 'Wrong question results');
});

test('setProfileProperties', function(assert) {
  let contextResult = this.subject({
    profileId: 'profile-id'
  });
  contextResult.setProfileProperties(Profile.create({
    firstName: 'first-name',
    lastName: 'last-name'
  }));

  assert.equal(contextResult.get('profileName'), 'first-name last-name', 'Wrong profile name');
});

test('findIndexByResourceId', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({
        resourceId: 'id1'
      }),
      ResourceResult.create({
        resourceId: 'id2'
      }),
      QuestionResult.create({
        resourceId: 'id3'
      })
    ])
  });

  assert.equal(contextResult.findIndexByResourceId('id2'), 1, 'Wrong resource index');
});

test('merge', function(assert) {
  let contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({
        resourceId: 'id1'
      }),
      ResourceResult.create({
        resourceId: 'id2'
      }),
      QuestionResult.create({
        resourceId: 'id3'
      })
    ])
  });

  let newResult = QuestionResult.create({
    resourceId: 'new',
    savedTime: 10,
    reaction: 1,
    answer: 'answer',
    score: 0
  });
  contextResult.merge('id3', newResult);

  assert.equal(contextResult.get('resourceResults').get(2).get('resourceId'), 'new', 'Wrong resource id');
  assert.equal(contextResult.get('resourceResults').get(2).get('savedTime'), 10, 'Wrong saved time');
  assert.equal(contextResult.get('resourceResults').get(2).get('reaction'), 1, 'Wrong reaction');
  assert.equal(contextResult.get('resourceResults').get(2).get('answer'), 'answer', 'Wrong answer');
  assert.equal(contextResult.get('resourceResults').get(2).get('score'), 0, 'Wrong score');
});
