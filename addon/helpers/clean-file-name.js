import Ember from 'ember';
import { getFileNameFromInvalidUrl } from 'quizzes-addon/utils/utils';

export function cleanFileName(value/*, hash*/) {
  return getFileNameFromInvalidUrl(value);
}

export default Ember.Helper.helper(cleanFileName);
