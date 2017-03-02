import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Context from 'quizzes/models/context/context';
import Collection from 'quizzes/models/collection/collection';

moduleForComponent('player/qz-player-confirmation', 'Integration | Component | player/qz player confirmation', {
  integration: true
});

test('Player confirmation Layout No more attempts', function(assert) {

  let attempts = ['attempt-id','attempt-2'];
  let collection = Collection.create({
    settings:{
      attempts:2
    },
    isAssessment:true
  });
  let context = Context.create({
    title:'context-title'
  });
  this.set('attempts',attempts);
  this.set('context',context);
  this.set('collection',collection);
  this.render(hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-player-confirmation').length,'Player confirmation component should appear');
  assert.ok($component.find('.qz-player-confirmation .panel-heading h3').length,'Missing title');
  assert.ok($component.find('.qz-player-confirmation .panel-body .description').length,'Missing description');
  assert.ok($component.find('.qz-player-confirmation .panel-body .no-more-attempts').length,'Missing no more attempts lead');
  assert.notOk($component.find('.qz-player-confirmation .panel-body .actions button').length,'Start button should not appear');
});

test('Player confirmation Layout has more attempts', function(assert) {

  let attempts = ['attempt-id','attempt-2'];
  let collection = Collection.create({
    settings:{
      attempts:4
    },
    isAssessment:true
  });
  let context = Context.create({
    title:'context-title'
  });
  this.set('attempts',attempts);
  this.set('context',context);
  this.set('collection',collection);
  this.render(hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context}}`);
  var $component = this.$();
  assert.notOk($component.find('.qz-player-confirmation .panel-body .no-more-attempts').length,'Missing no more attempts lead');
  assert.equal($component.find('.qz-player-confirmation .panel-body .actions button').prop('disabled'),false,'Start button should not be disabled');
});
