import Ember from 'ember';

export function isTeacher(params) {
  /**
   * @property {Class}
   */
  const aClass = params[0];
  const userId = params[1];
  return aClass.isTeacher(userId);
}

export default Ember.Helper.helper(isTeacher);
