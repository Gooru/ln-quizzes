import Ember from 'ember';
import Profile from 'quizzes/models/profile/profile';

export default Ember.Object.extend({

  /**
   * Normalizes assignees list
   * @param {*[]} payload
   * @returns {ResourceResult[]}
   */
   normalizeProfile: function(profile) {
     return Profile.create({
       id: profile.id,
       email: profile.email,
       firstName: profile.firstName,
       lastName: profile.lastName,
       username: profile.username
     });
   }
});
