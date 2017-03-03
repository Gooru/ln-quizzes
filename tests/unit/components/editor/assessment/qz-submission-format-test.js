import { moduleForComponent, test } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'dummy/locales/en/config';
import localeTranslations from 'dummy/locales/en/translations';

moduleForComponent('editor/assessment/qz-submission-format', 'Unit | Component | editor/assessment/qz submission format', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true,
  needs: [
    'service:i18n',
    'helper:t',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ]
});

test('selectType', function(assert) {
  let component = this.subject();
  component.send('selectType','upload');
  assert.equal(component.get('selectedType'),'upload','Upload should be the option selected');
});
