import Ember from 'ember';

export function plusOne(value /*, options*/) {
  return parseInt(value) + 1;
}

export default Ember.Helper.helper(plusOne);
