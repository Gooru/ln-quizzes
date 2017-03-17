import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import ContextResult from 'quizzes-addon/models/result/context';
import Ember from 'ember';

moduleForComponent('player/qz-player', 'Integration | Component | player/qz player', {
  integration: true
});

test('it renders', function(assert) {
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    collection,
    context:{id:'context-id',attempts:'2'}
  });
  this.set('contextResult', contextResult);
  this.render(hbs`{{player/qz-player contextResult=contextResult}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-player').length,'Assessment component should appear');
});

test('Show finish Confirmation', function(assert) {
  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    hasResources:true
  });
  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    collection,
    context:{id:'context-id',attempts:'2'}
  });
  this.set('contextResult', contextResult);
  this.set('showFinishConfirmation', true);
  this.set('showConfirmation',false);
  this.render(hbs`{{player/qz-player contextResult=contextResult showConfirmation=showConfirmation showFinishConfirmation=showFinishConfirmation}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-submit-confirmation').length,'Submit confirmation should appear');
});
