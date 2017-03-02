import Ember from 'ember';
import {noTags as cleanTags } from 'quizzes-addon/utils/utils';

export function noTags(params, hash) {
  return cleanTags(hash.text);
}

export default Ember.Helper.helper(noTags);
