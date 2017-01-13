import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('editor/assessment/gru-preview-url', 'Integration | Component | editor/assessment/gru preview url', {
  integration: true
});
test('Preview url layout', function (assert) {

  assert.expect(2);

  this.render(hbs`{{editor/assessment/gru-preview-url url=url}}`);

  var $component = this.$();

  assert.ok($component.find('.gru-preview-url .preview.show-legend span').length, 'Missing preview legend');

  const url = 'http://www.water4all.org/us/';
  this.set('url', url);

  assert.ok($component.find('.gru-preview-url .preview.show-url').length, 'Missing url preview');


});

test('Show url', function (assert) {

  assert.expect(2);

  const url = 'http://www.water4all.org/us/';

  this.set('url', url);
  this.render(hbs`{{editor/assessment/gru-preview-url url=url}}`);

  var $component = this.$();

  assert.ok($component.find('.gru-preview-url iframe').length, 'Missing url preview');
  assert.equal($component.find('iframe').attr('src'), 'http://www.water4all.org/us/', 'Wrong url');
});

test('Show image', function (assert) {

  assert.expect(2);

  const url = 'test/images/icon.png';

  this.set('url', url);

  this.render(hbs`{{editor/assessment/gru-preview-url url=url}}`);

  var $component = this.$();
  assert.ok($component.find('.gru-preview-url iframe').length,'Missing url preview');
  assert.equal($component.find('iframe').attr('src'), 'test/images/icon.png', 'Wrong url');
});

test('Show PDF', function (assert) {

  assert.expect(2);


  const url = 'http://www.worldanimalfoundation.net/f/koala.pdf';

  this.set('url', url);

  this.render(hbs`{{editor/assessment/gru-preview-url url=url}}`);

  var $component = this.$();

  assert.ok($component.find('.gru-preview-url iframe').length, 'Missing url preview');
  assert.equal($component.find('iframe').attr('src'), 'http://qacdn.gooru.org/qalive/f000/2441/3308/GooruLearnYourWay.pdf', 'Wrong url');
});
