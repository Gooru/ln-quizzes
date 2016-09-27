import Ember from 'ember';
export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  tagName: 'button',
  classNames:'btn btn-default btn-icon gru-share-pop-over',
  attributeBindings: ['dataToggle:data-toggle'],
  dataToggle:'popover',
  placement: 'bottom',

  clipboardEvents: ['success', 'error'],

  // -------------------------------------------------------------------------
  // Properties


  /**
   * @property {string} type
   */
  type:null,


  /**
   * @property {string} type
   */
  url:null,




  /**
   * @property {string} template to be used for the popover window
   */
  template: Ember.computed('type', function() {
    let tooltipText = this.get('i18n').t('gru-share-pop-over.copy').string;
    if(/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)){
      if (navigator.userAgent.indexOf('Mac OS X') !== -1) {
        tooltipText =this.get('i18n').t('gru-share-pop-over.safari-osx-tooltip').string;
      }else{
        tooltipText =this.get('i18n').t('gru-share-pop-over.multiarch-tooltip').string;
      }
    }
    if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
      tooltipText =this.get('i18n').t('gru-share-pop-over.ios-tooltip').string;
    }
   return `<div class="gru-share-pop-over-content">
    <p>${this.get('i18n').t('gru-share-pop-over.share-'+this.get('type')).string}</p>
    <div class="share-actions">
      <input id="${this.get('type')}-popover-input" value="${this.get('shareUrl')}" readonly type="text">
      <input type="button" data-toggle="tooltip" title="`+tooltipText+`" data-clipboard-target="#${this.get('type')}-popover-input" class="btn btn-primary copy-btn" value="${this.get('i18n').t('gru-share-pop-over.copy').string}">
    </div>
   </div>`;
 }),

  shareUrl: Ember.computed('type', function(){
    var params = this.get('router.router.state.params');
    params = params[Object.keys(params)[3]];
    const type = this.get("type");
    switch(type) {
      case 'course':
        return `${window.location.protocol}//${window.location.host}/content/courses/play/${params.courseId}`;
      case 'assessment':
        return `${window.location.protocol}//${window.location.host}/player/${params.assessmentId}?type=${type}`;
      case 'collection':
        return `${window.location.protocol}//${window.location.host}/player/${params.collectionId}?type=${type}`;
      case 'resource':
        return `${window.location.protocol}//${window.location.host}/content/resources/play/${params.resourceId}`;
      case 'question':
        return `${window.location.protocol}//${window.location.host}/content/questions/play/${params.questionId}`;
      default:
        break;
    }
  }),

  // -------------------------------------------------------------------------
  // Methods

  getTemplate: function(){
    return `<div class="gru-share-pop-over-window popover" role="tooltip">
      <div class="arrow"></div>
      <h3 class="popover-title"></h3>
      <div class="popover-content"></div>
    </div>`;
  },

 // -------------------------------------------------------------------------
 // Events

 /**
  * Overwrites didInsertElement hook to add clipboard and popover functionality
  */

  didInsertElement: function () {
    var component = this;
    component.$().popover({
      animation: false,
      placement: component.get('placement'),
      html: true,
      template:component.get('getTemplate')(),
      content: function() {
          return component.get('template');
        }
    });
    let clipboard = new Clipboard('.copy-btn');
    component.set('clipboard', clipboard);

    $('.copy-btn').tooltip({
      trigger:'manual',
      placement:'auto bottom'
    });
    component.get('clipboard').on('error', Ember.run.bind(this, function() {

      $('.copy-btn').tooltip('show');
    }));


  },
  // -------------------------------------------------------------------------
  // Events

  /**
   * Overwrites willDestroyElement hook. Destroys popover instance
   */
  willDestroyElement: function () {
    this.$().popover('destroy');
  },
  showErrorTooltip: function() {
    $('.copy-btn').tooltip('show');
  }


});
