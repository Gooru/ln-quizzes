import Ember from 'ember';
import Collection from 'quizzes/models/collection/collection';
import Resource from 'quizzes/models/resource/resource';
import ContextEvent from 'quizzes/models/result/teacher-context-event';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/teacher-context', 'Unit | Model | result/teacher-context');

test('resourceIds', function(assert) {
  let model = this.subject({
    collection: Collection.create({
      resources: Ember.A([
        Resource.create({
          id: 'resource1'
        }),
        Resource.create({
          id: 'resource2'
        })
      ])
    })
  });

  assert.equal(model.get('resourceIds').length, 2, 'Wrong total resources');
  assert.equal(model.get('resourceIds')[0], 'resource1', 'Wrong resource 1 id');
  assert.equal(model.get('resourceIds')[1], 'resource2', 'Wrong resource 2 id');
});


test('studentIds', function(assert) {
  let model = this.subject({
    contextEvents: Ember.A([
      ContextEvent.create({
        profileId: 'student1'
      }),
      ContextEvent.create({
        profileId: 'student2'
      })
    ])
  });

  assert.equal(model.get('studentIds').length, 2, 'Wrong total students');
  assert.equal(model.get('studentIds')[0], 'student1', 'Wrong student 1 id');
  assert.equal(model.get('studentIds')[1], 'student2', 'Wrong student 2 id');
});
