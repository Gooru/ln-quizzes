import { moduleFor, test } from 'ember-qunit';

moduleFor('model:context/context', 'Unit | Model | models/context/context', {
  unit: true
});

test('totalStudents', function(assert) {
  assert.expect(1);
  let model = this.subject({
    assignees: [{id:'assignee-1'},{id:'assignee-2'}]
  });

  assert.equal(model.get('totalStudents'),2,'Should have 2 assignees');
});
