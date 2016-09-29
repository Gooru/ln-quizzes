import Ember from 'ember';
import { getLetter } from 'quizzes/utils/utils';

export function answerLetter(value) {
  return getLetter(parseInt(value[0]));
}

export default Ember.Helper.helper(answerLetter);
