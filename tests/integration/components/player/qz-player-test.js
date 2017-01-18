import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Assessment from 'quizzes/models/content/assessment';
import ContextResult from 'quizzes/models/result/context';

moduleForComponent('player/qz-player', 'Integration | Component | player/qz player', {
  integration: true
});

test('it renders', function(assert) {
  this.set('collection', Assessment.create());
  this.set('contextResult', ContextResult.create());
  this.render(hbs`{{player/qz-player collection=collection contextResult=contextResult}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-player').length,'Assessment component should appear');
});
