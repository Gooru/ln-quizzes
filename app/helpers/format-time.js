import Ember from 'ember';
import { formatTime as formatMilliseconds } from 'quizzes/utils/utils';

export function formatTime(value /*, hash*/) {
  var time = value[0];
  return formatMilliseconds(time);
}

export default Ember.Helper.helper(formatTime);
