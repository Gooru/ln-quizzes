import Ember from 'ember';
import { roundFloat } from "quizzes-addon/utils/math";

export function roundNumber(value) {
  return roundFloat(value[0]);
}

export default Ember.Helper.helper(roundNumber);
