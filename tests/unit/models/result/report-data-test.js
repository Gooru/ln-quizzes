import Ember from 'ember';
import Collection from 'quizzes/models/collection/collection';
import Resource from 'quizzes/models/resource/resource';
import ReportDataEvent from 'quizzes/models/result/report-data-event';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/report-data', 'Unit | Model | result/report-data');

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
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1'
      }),
      ReportDataEvent.create({
        profileId: 'student2'
      })
    ])
  });

  assert.equal(model.get('studentIds').length, 2, 'Wrong total students');
  assert.equal(model.get('studentIds')[0], 'student1', 'Wrong student 1 id');
  assert.equal(model.get('studentIds')[1], 'student2', 'Wrong student 2 id');
});
