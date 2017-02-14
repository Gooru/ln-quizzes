import Ember from 'ember';
import TokenMixin from 'quizzes/mixins/token';

export default Ember.Object.extend(TokenMixin,  {

  /**
   * @property {Object} namespace base url for attempts endpoints
   */
  namespace: '/quizzes/api/v1/attempts',

  /**
   * Get data to show on the real time report
   * @param {String} contextId
   * @returns {Promise}
   */
  getReportData: function(contextId) {
    const namespace = this.get('namespace');
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: false,
      headers: Object.assign(this.get('headers'), {
        'profile-id': '7973e6c6-f0cd-4021-9c49-a0f9f26101b2',
        'lms-id': 'its_learning'
      })
    };
    const url = `${namespace}/${contextId}`;
    return Ember.$.ajax(url, options);
  }
});
