import TokenMixin from 'quizzes-addon/mixins/token';
import ApplicationAdapter from 'quizzes-addon/adapters/application';

export default ApplicationAdapter.extend(TokenMixin,  {

  /**
   * @property {string} namespace End-point URI
   */
  namespace: '/api/nucleus/v1/resources',

  /**
   * Reads a resource by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  readResource: function(resourceId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${resourceId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: this.get('headers')
    };
    return this.sendAjaxRequest(url, options);
  }
});
