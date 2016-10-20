import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assign-students'],

  // -------------------------------------------------------------------------
  // Properties
  students:Ember.A([
    Ember.Object.create({
      firstName:'firstname-1',
      lastName:'lastname-1'
    }),
    Ember.Object.create({
      firstName:'firstname-2',
      lastName:'lastname-2'
    }),
    Ember.Object.create({
      firstName:'firstname-3',
      lastName:'lastname-3'
    }),
    Ember.Object.create({
      firstName:'firstname-4',
      lastName:'lastname-4'
    }),
    Ember.Object.create({
      firstName:'firstname-5',
      lastName:'lastname-5'
    })
    ]),

    assessment:Ember.Object.create({
      title:'Water Cycle'
    })
  })
