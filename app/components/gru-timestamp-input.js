import Ember from 'ember';
const {
  computed,
  defineProperty
  } = Ember;

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-timestamp-input','validation'],

  classNameBindings: ['showErrorClass:has-error', 'isValid:has-success','valuePath'],

  // -------------------------------------------------------------------------
  // Actions
  actions:{
    inputValueChange: function() {
      this.set('rawDateValue',this.removeWhiteSpaces(this.get('rawDateValue')));
      this.set('valueDate', this.get('rawDateValue'));
      this.set('rawTimeValue',this.removeWhiteSpaces(this.get('rawTimeValue')));
      this.set('valueTime', this.get('rawTimeValue'));
      if(this.get('rawDateValue') && this.get('rawTimeValue')){
        this.set(`model.${this.get('valuePath')}`,this.getDate());
      }else{
        this.set(`model.${this.get('valuePath')}`,'');
      }
      this.set('isTyping', false);
      if (this.get('onFocusOut')){
        this.sendAction('onFocusOut');
      }
    },

    inputTyping: function() {
      this.set('isTyping', true);
      if (this.get('onTyping')){
        this.sendAction('onTyping');
      }
    },

    enterPressed: function() {
      this.set('rawDateValue',this.removeWhiteSpaces(this.get('rawDateValue')));
      this.set('valueDate', this.get('rawDateValue'));
      this.set('rawTimeValue',this.removeWhiteSpaces(this.get('rawTimeValue')));
      this.set('valueTime', this.get('rawTimeValue'));
      this.set('isTyping', false);
      this.get('onEnter') && this.get('isValid') && this.get('onEnter')(this.get('valueDate'))&& this.get('onEnter')(this.get('valueTime'));
    }
  },
  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    var valuePath = this.get('valuePath');
    defineProperty(this, 'attributeValidation', computed.oneWay(`model.validations.attrs.${valuePath}`));
    this.set('rawDateValue',this.get(`model.${valuePath}`) ? this.getDateFromTimestamp(this.get(`model.${valuePath}`))[0]:'');
    this.set('rawTimeValue',this.get(`model.${valuePath}`) ? this.getDateFromTimestamp(this.get(`model.${valuePath}`))[1]:'');
  },

  didInsertElement (){
    this.setDatePicker();
  },
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @param {Object} model - Model that will be attached to the component
   */
  model: null,
  /**
   * @param {String} valuePath - value used to set the attributeValidation
   */
  valuePath:null,

  /**
   * @param {String} dateID - value date element id
   */
  dateID:Ember.computed('valuePath',function(){
    return `date${this.get('valuePath')}`;
  }),

  /**
   * @param {String} timeID - value time element id
   */
  timeID:Ember.computed('valuePath',function(){
    return `time${this.get('valuePath')}`;
  }),

  /**
   * @param {String} rawDateValue - unformatted value of the input field
   */
  rawDateValue: null,

  /**
   * @param {String} rawTimeValue - unformatted value of the input field
   */
  rawTimeValue: null,
  /**
   * @param {String} type - type of the input field.
   */
  type: 'text',
  /**
   * @param {String} valueDatePath - value used to set the rawDateValue
   */
  valueDatePath: '',
  /**
   * @param {String} valuePath - value used to set the rawTimeValue
   */
  valueTimePath: '',
  /**
   * @param {Object} attributeValidation - value used to set the rawDateValue
   */
  attributeValidation: null,
  /**
   * @param {Boolean} isTyping - Flag for when user is typing
   */
  isTyping: false,
  /**
   * @property {string} onFocusOut action
   */
  onFocusOut: null,

  /**
   * @property {string} onTyping action
   */
  onTyping: null,

  /**
   * Indicates if
   * @property {boolean}
   */
  autofocus: false,

  /**
   * @param {Computed } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  /**
   * @param {Computed } showErrorClass - computed property that defines the
   */
  showErrorClass: computed('showMessage', 'hasContent', 'attributeValidation', function() {
    return this.get('attributeValidation') && this.get('showMessage') && this.get('hasContent');
  }),
  /**
   * @param {Computed } hasContent - computed property that defines whether the rawDateValue and rawTimeValue is null or not.
   */
  hasContent: Ember.computed.and('rawDateHasContent', 'rawTimeHasContent'),
  /**
   * @param {Computed } hasContent - computed property that defines whether the rawDateValue is null or not.
   */
  rawDateHasContent: computed.notEmpty('rawDateValue'),
  /**
   * @param {Computed } hasContent - computed property that defines whether the rawTimeValue is null or not.
   */
  rawTimeHasContent: computed.notEmpty('rawTimeValue'),
  /**
   * @param {Computed } isValid -  A computed property that says whether the value is valid
   */
  isValid: computed.readOnly('attributeValidation.isValid'),
  /**
   * @param {Computed } isInvalid - A computed property that says whether the value is invalid
   */
  isInvalid: computed.oneWay('attributeValidation.isInvalid'),
  /**
   * @param {Computed } hasContent - computed property that defines what message to show
   */
  showMessage: computed('attributeValidation.isDirty', 'isInvalid', 'didValidate', 'isTyping', function() {
    return (this.get('attributeValidation.isDirty') || this.get('didValidate')) && this.get('isInvalid') && !this.get('isTyping');
  }),
  // -------------------------------------------------------------------------
  // Methods

  /**
   * Remove white spaces from input
   */
  removeWhiteSpaces:function(value){
    return $.trim(value);
  },

  /**
   * Get a format date from timestamp
   */
  getDateFromTimestamp:function(timeStamp){
    let date = moment(timeStamp);
    return [date.format('L'),date.format('LT')];
  },

  /**
   * Get timestamp date
   */
  getDate:function(){
    return moment(new Date(this.get('rawDateValue')+" "+this.get('rawTimeValue'))).valueOf();
  },

  /**
   * Set date picker component
   */
  setDatePicker:function(){
    $(`#${this.get('dateID')}`).datepicker({
      autoclose: true,
      startDate: new Date()
    });
    $(`#${this.get('timeID')}`).timepicker({
      'showDuration': true,
      'timeFormat': 'g:i A'
    });
  }
});
