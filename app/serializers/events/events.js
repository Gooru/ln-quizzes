import Ember from 'ember';

export default Ember.Object.extend({

  /**
   * Serializes a ResourceResult
   * @param {ResourceResult} resourceResult
   * @returns {*}
   */
  serializeResourceResult: function (resourceResult) {
    let serialized = {
      reaction: resourceResult.get('reaction'),
      resourceId: resourceResult.get('resourceId'),
      timeSpent: resourceResult.get('timeSpent')
    };

    if (resourceResult.get('isQuestion')) {
      serialized.answer = resourceResult.get('answer');
    }
    return serialized;
  }

});
