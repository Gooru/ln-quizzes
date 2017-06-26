import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-preview-url'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} the calculated resource content height
   */
  calculatedResourceContentHeight: null,

  /**
   * @property {Service} Configuration service
   */
  quizzesConfigurationService: Ember.inject.service('quizzes/configuration'),

  /**
   * @property {string} bind the height css style for the component
   */
  resourceHeight: Ember.computed('calculatedResourceContentHeight', function () {
    var height = this.get('calculatedResourceContentHeight');
    const heightString = height > 0 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(`height: ${heightString}`);
  }),

  /**
   * @property {string} Resource URL
   */
  url: Ember.computed('resource.body', function () {
    let component = this;
    let cdnUrl = component.get('quizzesConfigurationService.configuration.properties.cdnURL');
    let resourceUrl = component.get('resource.body');
    if (resourceUrl) {
      const protocolPattern = /^((http|https|ftp):\/\/)/;
      if (!protocolPattern.test(resourceUrl)) {     //if no protocol add it
        let containsCdnUrl = (resourceUrl.indexOf(cdnUrl) !== -1);
        if (!containsCdnUrl) {
          resourceUrl = 'https:' + cdnUrl + resourceUrl;
        }
      }
    }
    return resourceUrl;
  }),

  resource: null

});
