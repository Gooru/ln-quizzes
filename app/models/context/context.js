import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  availableDate:{
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.available-date-error'
      })
    ]
  },
  dueDate: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.due-date-presence-error'
      }),
      validator('number-compare', {
        property:'availableDate'
      })
    ]
  }
});

/**
 * Context model
 * typedef {Object} Context
 */
const Context = Ember.Object.extend(Validations,{

  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {string} title
   */
  title: null,


  /**
   * @property {string}
   */
  description: '',

  /**
   * @property {}
   */
  standards: [],
  /**
  * @property {boolean}
  */
  isActive:false,

  /**
   * @property {number}
   */
  createdDate:null,

  /**
   * @property  {number}
   */
  availableDate: null,


  /**
   * @property {number}
   */
  modifiedDate:null,
  /**
   * @property {number}
   */
  dueDate:null,

  /**
   * @property {[Profile]}
   */
  assignees:[],
  /**
   * @property {number}
   */
  totalStudents:Ember.computed.alias('assignees.length'),
  /**
   * @property {Profile}
   */
  owner:null,
  /**
   * @property {number}
   */
  externalCollectionId:null,

  /**
   * @property {Collection}
   */
  collection: null

});

export default Context;
