import ApplicationAdapter from '../application';

/**
 * Lesson model adapter
 *
 * @typedef {Object} LessonAdapter
 */
export default ApplicationAdapter.extend({

  /**
   * @property {string} End-point URI
   */
  namespace: '/gooruapi/rest',

  /**
   * Builds the end-point URL for the queryRecord method
   * @param query
   * @returns {String}
   */
  urlForQueryRecord: function(query) {
    const namespace = this.get('namespace');
    const classId = query.classId;
    const courseId = query.courseId;
    const unitId= query.unitId;
    const lessonId = query.lessonId;
    const options = query.options;

    delete query.classId;
    delete query.courseId;
    delete query.unitId;
    delete query.lessonId;
    delete query.options;

    if (options.queryType === 'byId') {
      return `${namespace}/v1/course/${courseId}/unit/${unitId}/lesson/${lessonId}`;
    } else {
      return `${namespace}/v3/class/${classId}/course/${courseId}/unit/${unitId}/lesson`;
    }
  }

});
