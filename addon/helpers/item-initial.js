import Ember from 'ember';

// constants
import { CONTENT_TYPES } from "quizzes-addon/config/quizzes-config";

export function itemInitial(value /*, options*/) {
  if (value[0] === CONTENT_TYPES.ASSESSMENT) {
    return "common.assessmentInitial";
  }
  return "common.collectionInitial";
}

export default Ember.Helper.helper(itemInitial);
