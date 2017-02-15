import Ember from 'ember';
import Profile from 'quizzes/models/profile/profile';

export default Ember.Object.extend({

  /**
   * Normalizes a list of profiles
   * @param {Object[]} payload
   * @returns {Profile[]}
   */
   normalizeProfiles: function(profiles) {
     let serializer = this;
     return profiles.users.reduce((profilesById, profile) => {
       profilesById[profile.id] = serializer.normalizeProfile(profile);
       return profilesById;
     }, {});
   },

  /**
   * Normalize a profile
   * @param {Object} payload
   * @returns {Profile}
   */
   normalizeProfile: function(profile) {
     return Profile.create({
       id: profile.id,
       email: profile.email,
       firstName: profile.first_name,
       lastName: profile.last_name,
       username: profile.username
     });
   }
});
