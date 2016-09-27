import PerformanceSerializer from './performance';

/**
 * CollectionPerformance serializer
 *
 * @typedef {Object} CollectionPerformanceSerializer
 */
export default PerformanceSerializer.extend({

  isCollection: function(payload) {
    return !!payload.collectionId;
  },

  getModelId: function(payload) {
    return this.isCollection(payload) ? payload.collectionId : payload.assessmentId;
  },

  getModelType: function() {
    return 'performance/collection-performance';
  },

  getObjectType: function(payload) {
    return this.isCollection(payload) ? 'collection' : 'assessment';
  }

});
