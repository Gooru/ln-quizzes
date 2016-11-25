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

test('students', function(assert) {
  let model = this.subject({
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: 'student1',
        profileCode: 'code1',
        profileName: 'name1'
      }),
      ReportDataEvent.create({
        profileId: 'student2',
        profileCode: 'code2',
        profileName: 'name2'
      })
    ])
  });

  assert.equal(model.get('students').length, 2, 'Wrong total students');
  assert.equal(model.get('students')[0].id, 'student1', 'Wrong student 1 id');
  assert.equal(model.get('students')[0].code, 'code1', 'Wrong student 1 code');
  assert.equal(model.get('students')[0].fullName, 'name1', 'Wrong student 1 name');
  assert.equal(model.get('students')[1].id, 'student2', 'Wrong student 2 id');
  assert.equal(model.get('students')[1].code, 'code2', 'Wrong student 1 code');
  assert.equal(model.get('students')[1].fullName, 'name2', 'Wrong student 1 name');
});
