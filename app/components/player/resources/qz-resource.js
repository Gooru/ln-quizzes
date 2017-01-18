import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames:['qz-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} the calculated resource content height
   */
  calculatedResourceContentHeight: null,

  /**
   * @property {Resource} the resource
   */
  resource: null,

  /**
   * @property {string} bind the height css style for the component
   */
  resourceHeight: Ember.computed('calculatedResourceContentHeight', function() {
    var height = this.get('calculatedResourceContentHeight');
    const heightString = height > 0 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(`height: ${heightString}`);
  })

  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods

});
