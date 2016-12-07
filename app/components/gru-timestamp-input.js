import Ember from 'ember';
const {
  computed,
  defineProperty
  } = Ember;

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-timestamp-input','validation'],

  classNameBindings: ['valuePath'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    inputValueChange: function() {
      this.setInputValues();
      this.set(`model.${this.get('datePath')}`,this.get('rawDateValue'));
      this.set(`model.${this.get('timePath')}`,this.get('rawTimeValue'));
      this.set(`model.${this.get('valuePath')}`,this.getDate());
      this.set('isTyping', false);
      if (this.get('onFocusOut')) {
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
      this.setInputValues();
      this.set('isTyping', false);
      this.get('onEnter') && this.get('isValid') && this.get('onEnter')(this.get('valueDate'))&& this.get('onEnter')(this.get('valueTime'));
      this.get('onEnter') && this.get('isDateValid') && this.get('onEnter')(this.get('valueDate'));
      this.get('onEnter') && this.get('isTimeValid') && this.get('onEnter')(this.get('valueTime'));
    }
  },
  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    var valuePath = this.get('valuePath');
    defineProperty(this, 'attributeValidation', computed.oneWay(`model.validations.attrs.${valuePath}`));
    defineProperty(this, 'dateValidation',valuePath === 'availableDate'? computed.oneWay('model.validations.attrs.availableDay') : computed.oneWay('model.validations.attrs.dueDay'));
    defineProperty(this, 'timeValidation',valuePath === 'availableDate'? computed.oneWay('model.validations.attrs.availableTime') : computed.oneWay('model.validations.attrs.dueTime'));
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
  valuePath: null,
  /**
   * @param {String} datePath - value used to set the dateValidation
   */
  datePath: Ember.computed(function() {
    return this.get('valuePath') === 'availableDate'? 'availableDay' : 'dueDay';
  }),
  /**
   * @param {String} timePath - value used to set the timeValidation
   */
  timePath: Ember.computed(function() {
    return this.get('valuePath') === 'availableDate'? 'availableTime' : 'dueTime';
  }),
  /**
   * @param {String} dateID - value date element id
   */
  dateID: Ember.computed('valuePath',function() {
    return `date-${this.get('valuePath')}`;
  }),
  /**
   * @param {String} timeID - value time element id
   */
  timeID: Ember.computed('valuePath',function() {
    return `time-${this.get('valuePath')}`;
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
   * @param {String} valueDate - value used to set the rawDateValue
   */
  valueDate: '',
  /**
   * @param {String} valueTime - value used to set the rawTimeValue
   */
  valueTime: '',
  /**
   * @param {Object} attributeValidation - value used to set the rawDateValue
   */
  attributeValidation: null,

  /**
   * @param {Object} dateValidation
   */
  dateValidation: null,

  /**
   * @param {Object} timeValidation
   */
  timeValidation: null,
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
   * Indicates if the component should show the actual date as default
   * @property {boolean}
   */
  setActualDate: false,
  /**
   * @param {Computed } didValidate - value used to check if input has been validated or not
   */
  didValidate: false,

  /**
   * @param {Computed } showErrorClass - computed property that defines the
   */
  showErrorClass: computed('showMessage','attributeValidation', function() {
    return this.get('attributeValidation') && this.get('showMessage');
  }),

  /**
   * @param {Computed } showDateErrorClass - computed property that defines the
   */
  showDateErrorClass: computed('isValid','dateIsInvalid', function() {
    return this.get('dateIsInvalid');
  }),
  /**
   * @param {Computed } showTimeErrorClass - computed property that defines the
   */
  showTimeErrorClass: computed('isValid','timeIsInvalid', function() {
    return this.get('timeIsInvalid');
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
   * @param {Computed } isDateValid -  A computed property that says whether the value is valid
   */
  isDateValid: computed.readOnly('dateValidation.isValid'),
  /**
   * @param {Computed } isTimeValid -  A computed property that says whether the value is valid
   */
  isTimeValid: computed.readOnly('timeValidation.isValid'),
  /**
   * @param {Computed } isInvalid - A computed property that says whether the value is invalid
   */
  isInvalid: computed.oneWay('attributeValidation.isInvalid'),
  /**
   * @param {Computed } dateIsInvalid - A computed property that says whether the value is invalid
   */
  dateIsInvalid: computed.oneWay('dateValidation.isInvalid'),
  /**
   * @param {Computed } timeIsInvalid - A computed property that says whether the value is invalid
   */
  timeIsInvalid: computed.oneWay('timeValidation.isInvalid'),
  /**
   * @param {Computed } showMessage - computed property that defines what message to show
   */
  showMessage: computed('attributeValidation.isDirty', 'isInvalid', 'didValidate', 'isTyping', function() {
    return (this.get('attributeValidation.isDirty') || this.get('didValidate')) && this.get('isInvalid') && !this.get('isTyping');
  }),
  /**
   * @param {Computed } showDateMessage - computed property that defines what message to show
   */
  showDateMessage: computed('dateValidation.isDirty', 'dateIsInvalid', 'didValidate', 'isTyping', function() {
    return (this.get('dateValidation.isDirty') || this.get('didValidate')) && this.get('dateIsInvalid') && !this.get('isTyping');
  }),

  /**
   * @param {Computed } showDateMessage - computed property that defines what message to show
   */
  showTimeMessage: computed('timeValidation.isDirty', 'timeIsInvalid', 'didValidate', 'isTyping', function() {
    return (this.get('timeValidation.isDirty') || this.get('didValidate')) && this.get('timeIsInvalid') && !this.get('isTyping');
  }),
  /**
   * @param {Computed } showErrorDateInput - computed property that defines if the date input is invalid
   */
  showErrorDateInput: computed('dateValidation.isDirty', 'dateIsInvalid','attributeValidation',function() {
    let errorClass = "";
    if(this.get('dateValidation.isDirty')){
        if(this.get('attributeValidation.errors.length')&& this.get('dateValidation.errors.length')){
          errorClass = 'has-error' ;
        }else {
        errorClass = this.get('dateIsInvalid') ? 'has-error' : 'has-success';
        }
      }
    return errorClass;
  }),

  /**
   * @param {Computed } showErrorTimeInput - computed property that defines if the time input is invalid
   */
  showErrorTimeInput: computed('timeValidation.isDirty', 'timeIsInvalid','attributeValidation',function() {
    let errorClass = "";
    if(this.get('timeValidation.isDirty')){
      if(this.get('attributeValidation.errors.length')&& this.get('timeValidation.errors.length')){
        errorClass = 'has-error' ;
      }else{
        errorClass = this.get('timeIsInvalid') ? 'has-error' : 'has-success';
      }
    }
    return errorClass;
  }),

  // -------------------------------------------------------------------------
  // Methods
  /**
   * Get a format date from timestamp
   */
  getDateFromTimestamp: function(timeStamp) {
    let date = moment(timeStamp);
    return [date.format('L'),date.format('LT')];
  },

  /**
   * Get timestamp date
   */
  getDate: function() {
    return moment(new Date(this.get('rawDateValue')+" "+this.get('rawTimeValue'))).valueOf();
  },
  /**
   * Initialize the date picker component
   */
  setDatePicker: function() {
    let $day = $(`#${this.get('dateID')}`);
    let $time = $(`#${this.get('timeID')}`);

    $day.datepicker({
      autoclose: true,
      startDate: new Date()
    });

    $time.timepicker({
      'showDuration': true,
      'timeFormat': 'g:i A'
    });

    $day.on('changeDate', function() {
      var dateValue = $day.datepicker('getFormattedDate');
      $day.val(dateValue);
      $day.blur();
    });

    if(this.get('setActualDate')){
      $day.datepicker('setDate', new Date());
      $day.datepicker('update');
      $time.timepicker('setTime', '12:00 am');
      $day.blur();
      $time.blur();
    }
  },
  /**
   * Set the value of date and time input
   */
  setInputValues: function(){
    let $day = $(`#${this.get('dateID')}`);
    let $time = $(`#${this.get('timeID')}`);
    this.set('rawDateValue',$day.val());
    this.set('valueDate', this.get('rawDateValue'));
    this.set('rawTimeValue',$time.val());
    this.set('valueTime', this.get('rawTimeValue'));
  },

  // -------------------------------------------------------------------------
  // Observers
  /**
   * Set the default time when the date is selected for due date
   */
  setDefaultTime: Ember.observer('rawDateValue', function() {
    let $time = $(`#${this.get('timeID')}`);
    if(!this.get('setActualDate')){
      if(this.get('rawDateValue') !==''){
        $time.timepicker('setTime', '11:30 pm');
        $time.blur();
      }
    }
  })
});
