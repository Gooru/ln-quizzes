import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:unit/unit', 'Unit | Adapter | unit/unit', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('UrlForQueryRecord for one specific unit', function(assert) {
  const adapter = this.subject();
  const query = {
    courseId: 'course-id-1',
    unitId: 'unit-id-1',
    options: { queryType: 'byId' }
  };
  const url = adapter.urlForQueryRecord(query);

  assert.equal(url, '/gooruapi/rest/v1/course/course-id-1/unit/unit-id-1', 'Wrong url');
});

test('UrlForQueryRecord for many units', function(assert) {
  const adapter = this.subject();
  const query = {
    classId: 'class-id-1',
    courseId: 'course-id-1',
    options: {}
  };
  const url = adapter.urlForQueryRecord(query);

  assert.equal(url, '/gooruapi/rest/v3/class/class-id-1/course/course-id-1/unit', 'Wrong url');
});
