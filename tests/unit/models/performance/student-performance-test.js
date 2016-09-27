import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';


moduleForModel('performance/student-performance', 'Unit | Model | performance/student-performance', {
  // Specify the other units that are required for this test.
  needs: ['model:performance/performance', 'model:user/user', 'model:meta', 'model:taxonomy-preference']
});

test('Student average calculations for existing units', function(assert) {
  var store = this.store();
  var user;
  var performanceData = Ember.A();
  Ember.run(function () {
    user = store.createRecord("user/user", {id: 'user-id-1', firstName: 'FirstName', lastName: 'LastName'});
    performanceData.pushObject(store.createRecord("performance/performance", { id: '1', score: 50, completionDone: 5, completionTotal: 20, timeSpent: 1000 }));
    performanceData.pushObject(store.createRecord("performance/performance", { id: '2', score: 75, completionDone: 10, completionTotal: 20, timeSpent: 500 }));
    performanceData.pushObject(store.createRecord("performance/performance", { id: '3', score: 100, completionDone: 15, completionTotal: 20, timeSpent: 1500 }));
  });
  var model = this.subject({
    user: user,
    performanceData: performanceData
  });

  assert.equal(model.get('averageScore'), 75);
  assert.equal(model.get('averageTimeSpent'), 1000);
  assert.equal(model.get('sumCompletionDone'), 30);
  assert.equal(model.get('sumCompletionTotal'), 60);
});

test('Student average calculations for non existing units', function(assert) {
  var store = this.store();
  var user;
  var performanceData = Ember.A();
  Ember.run(function () {
    user = store.createRecord("user/user", {id: 'user-id-1', firstName: 'FirstName', lastName: 'LastName'});
  });
  var model = this.subject({
    user: user,
    performanceData: performanceData
  });

  assert.equal(model.get('averageScore'), -1);
  assert.equal(model.get('averageTimeSpent'), -1);
  assert.equal(model.get('sumCompletionDone'), 0);
  assert.equal(model.get('sumCompletionTotal'), 0);
});
