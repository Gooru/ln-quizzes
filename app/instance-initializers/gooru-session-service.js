import Ember from 'ember';

export function initialize(application) {
  const sessionService = application.lookup('service:session');

  sessionService.reopen({
    /**
     * @property {string} Session token
     */
    token: Ember.computed.alias('data.authenticated.token'),

    // TODO This property should be removed once API 2.0 is not needed anymore
    /**
     * @property {string} Session Token coming from API 3.0
     */
    'token-api3': Ember.computed.alias('data.authenticated.token-api3'),

    /**
     * @property {string} Session user data
     */
    userData: Ember.computed.alias('data.authenticated.user'),

    /**
     * @property {string} Session user data
     */
    cdnUrls: Ember.computed.alias('data.authenticated.cdnUrls'),

    /**
     * @property {string} Session user id
     */
    userId: Ember.computed('userData', function() {
      return this.get('userData')['gooruUId'];
    }),

    /**
     * @property {boolean} Indicates if the session is for an anonymous user
     */
    isAnonymous:  Ember.computed('data.authenticated', function() {
      return this.get('data.authenticated')['isAnonymous'];
    }),

    /**
     * This method authenticates using the default authenticator for an anonymous user
     * @returns {*|Ember.RSVP.Promise}
     */
    authenticateAsAnonymous: function() {
      return this.authenticate('authenticator:auth-api-3', { isAnonymous: true });
    }
  });
}

export default {
  name: 'gooru-session-service',
  after: 'ember-simple-auth',
  initialize: initialize
};
