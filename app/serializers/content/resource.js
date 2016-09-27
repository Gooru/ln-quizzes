import Ember from 'ember';
import ResourceModel from 'gooru-web/models/content/resource';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';

/**
 * Serializer to support the Resource CRUD operations for API 3.0
 *
 * @typedef {Object} ResourceSerializer
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('taxonomySerializer', TaxonomySerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Serialize a Resource object into a JSON representation required by the Create Resource endpoint
   *
   * @param resourceModel The Resource model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeCreateResource: function(resourceModel) {
    const format = ResourceModel.serializeResourceFormat(resourceModel.get("format"));
    return {
      title: resourceModel.get('title'),
      url: resourceModel.get("url"),
      content_subformat: format,
      'visible_on_profile': resourceModel.get('isVisibleOnProfile')
    };
  },

  /**
   * Serialize a Resource object into a JSON representation required by the Update Resource endpoint
   *
   * @param resourceModel The Resource model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateResource: function(resourceModel) {
    const serializer = this;
    let serializedResource = {
      title: resourceModel.get('title'),
      description: resourceModel.get('description'),
      narration: resourceModel.get('narration'),
      'content_subformat': ResourceModel.serializeResourceFormat(resourceModel.get("format")),
      taxonomy: serializer.get('taxonomySerializer').serializeTaxonomy(resourceModel.get('standards')),
      'visible_on_profile': resourceModel.get('isVisibleOnProfile'),
      //"depth_of_knowledge": null, // Not required at the moment
      //"thumbnail": null // Not required at the moment
      //one publisher for now
      'copyright_owner': resourceModel.get('publisher') ? [resourceModel.get('publisher')] : [''] ,
      'is_copyright_owner': resourceModel.get('amIThePublisher'),
      'display_guide' : resourceModel.get('displayGuide') ? {"is_broken": 0, "is_frame_breaker": 1} : {"is_broken": 0, "is_frame_breaker": 0}
    };
    return serializedResource;
  },

  /**
   * Normalize the resource data into a Resource object
   * @param resourceData
   * @returns {Resource}
   */
  normalizeReadResource: function(resourceData) {
    const serializer = this;
    const format = ResourceModel.normalizeResourceFormat(resourceData.content_subformat);
    const standards = resourceData.taxonomy || {};
    const basePath = serializer.get('session.cdnUrls.content');
    const info = resourceData.info || {};
    const resource = ResourceModel.create(Ember.getOwner(serializer).ownerInjection(), {
      id: resourceData.id,
      title: resourceData.title,
      url: resourceData.url,
      format: format,
      description: resourceData.description,
      narration: resourceData.narration,
      publishStatus: resourceData.publish_status,
      standards: serializer.get('taxonomySerializer').normalizeTaxonomyObject(standards),
      owner: resourceData.creator_id,
      info: info,
      amIThePublisher: resourceData['is_copyright_owner'] || false,
      publisher: info.publisher ? info.publisher[0] : null,
      isVisibleOnProfile: typeof resourceData.visible_on_profile !== 'undefined' ? resourceData.visible_on_profile : true,
      order: resourceData.sequence_id,
      displayGuide:resourceData['display_guide']&& (resourceData['display_guide'].is_broken ===1 || resourceData['display_guide'].is_frame_breaker ===1)
    });
    resource.set('displayGuide', resource.get("displayGuide") || this.checkURLProtocol(resource.url));

    //is full path if it has protocol
    const isFullPath = resourceData.url ? /^(?:[a-z]+:)?\/\//.exec(resourceData.url) : false;

    if (resource.get("isImageResource") || resource.get("isPDFResource")){
      if (!isFullPath){ // if it is a relative url, load from content cdn
        const url = resourceData.url ? basePath + resourceData.url : null;
        resource.set("url", url);
      }
    }

    if (resource.get("isUrlResource")) {
      if(resource.get("displayGuide")) {
        var url = resource.get("url");
        var pattern = /^((http|https|ftp):\/\/)/;

        if(!pattern.test(url)) {
          url = "http:" + basePath + url;
        }
        resource.set("url", url);
      }
      else{
        if (!isFullPath){ //if no protocol add http as default
          const url = resourceData.url ? "http://" + resourceData.url : null;
          resource.set("url", url);
        }
      }
    }
    return resource;
  },
  checkURLProtocol: function(url){
    return (window.location.protocol === 'https:'  && /^((http):\/\/)/.test(url));
  }
});
