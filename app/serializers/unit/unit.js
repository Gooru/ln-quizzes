import Ember from 'ember';
import DS from 'ember-data';

/**
 * Unit serializer for Unit model
 *
 * @typedef {Object} UnitSerializer
 */
export default DS.JSONAPISerializer.extend({

  /**
   * Normalize a queryRecord response
   * @param store
   * @param primaryModelClass
   * @param payload
   * @returns {Unit|Unit[]} Returns a Units or arrays of Units
   */
  normalizeQueryRecordResponse: function(store, primaryModelClass, payload) {
    const serializer = this;
    const  isMultipleResult = Ember.isArray(payload);
    if (isMultipleResult) {
      var model = { data: [] };
      Ember.$.each(payload, function(index, result){
        model.data.push(serializer.normalizeUnit(result));
      });
      return model;
    } else {
      return {
        data: this.normalizeUnit(payload)
      };
    }
  },

  normalizeUnit: function(payload) {
    return {
      id: payload.gooruOid,
      type: 'unit/unit',
      attributes: {
        title: payload.title,
        collection: payload.collectionId,
        visibility: payload.visibility ? payload.visibility : false
      }
    };
  }

});
