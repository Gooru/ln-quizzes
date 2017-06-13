import Ember from 'ember';

export function safeHtml(value) {
  return Ember.String.htmlSafe(value);
}

export default Ember.Helper.helper(safeHtml);
