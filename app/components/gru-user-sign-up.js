import Ember from "ember";
import ModalMixin from '../mixins/modal';

/**
 * User sign up
 *
 * Component that retrieves a user's information for signing up into the system.
 * May be embedded into a modal window (@see gru-modal).
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend(ModalMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} User service API SDK
   */
  userService: Ember.inject.service("api-sdk/user"),

  profileService: Ember.inject.service("api-sdk/profile"),

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['gru-user-sign-up'],

  classNameBindings: ['component-class', 'valuePath'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Sign up user
     */
    signUp: function() {
      const component = this;
      let userModel = this.get('user');
      component.get('profileService').createProfile(userModel)
        .then(function() {
          component.triggerAction({ action: 'closeModal' });
          }, function() {
            Ember.Logger.error('Error signing up user');
          });

      // TODO We need to enable validation but first we need to implement API 3.0 Availabilty integration
      /*
      var userModel = this.get('user');
      userModel.validate().then(({
        model, validations
        }) => {
        if (validations.get('isValid')) {

          component.get("userService")
            .save(model)
            .then(function() {
              this.triggerAction({
                action: 'closeModal'
              });
            }.bind(this),
              function() {
                Ember.Logger.error('Error signing up user');
              });
          this.setProperties({
            showAlert: false,
            isRegistered: true,
            showCode: false
          });
        } else {
          this.set('showAlert', true);
        }
        this.set('didValidate', true);
      }, () => {

      });
      */
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    var component = this;
    component.$("[data-toggle='tooltip']").tooltip({trigger: "hover"});
  },

  setupUserModel: function() {
    var userModel = this.get("userService").newUser();
    this.set('user', userModel);
  }.on('init'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @type {?String} specific class
   */
  'component-class':null

});
