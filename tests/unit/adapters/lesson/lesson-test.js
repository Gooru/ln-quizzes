import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:lesson/lesson', 'Lesson | Adapter | lesson/lesson', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('UrlForQueryRecord for one specific lesson', function(assert) {
  const adapter = this.subject();
  const query = {
    courseId: 'course-id-1',
    unitId: 'unit-id-1',
    lessonId: 'lesson-id-1',
    options: { queryType: 'byId' }
  };
  const url = adapter.urlForQueryRecord(query);

  assert.equal(url, '/gooruapi/rest/v1/course/course-id-1/unit/unit-id-1/lesson/lesson-id-1', 'Wrong url');
});

test('UrlForQueryRecord for many lessons', function(assert) {
  const adapter = this.subject();
  const query = {
    classId: 'class-id-1',
    courseId: 'course-id-1',
    unitId: 'unit-id-1',
    options: {}
  };
  const url = adapter.urlForQueryRecord(query);

  assert.equal(url, '/gooruapi/rest/v3/class/class-id-1/course/course-id-1/unit/unit-id-1/lesson', 'Wrong url');
});
