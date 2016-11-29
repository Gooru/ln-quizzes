import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  i18n: Ember.inject.service(),
  validate(value, options,model) {
    return  value > model.get(options.property) ? true : this.get('i18n').t("common.errors.due-date-error").string;
  }
});
