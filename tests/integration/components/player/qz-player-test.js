import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import ContextResult from 'quizzes-addon/models/result/context';
import ResourceResult from 'quizzes-addon/models/result/resource';
import ResourceModel from 'quizzes-addon/models/resource/resource';
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

test('Previous button at the first element of the collection', function(assert) {
  const resourceMockA = Ember.Object.create({
    id: '1',
    title: '<p>Resource #1</p>',
    format: 'question',
    'isQuestion': true
  });

  const resourceMockB = Ember.Object.create({
    id: '2',
    title: 'Resource #2',
    format: 'webpage',
    'isQuestion': false
  });

  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    isCollection: true,
    resources: Ember.A([
      resourceMockA,
      resourceMockB
    ])
  });

  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    collection,
    context:{id:'context-id',attempts:'2'}
  });
  this.set('contextResult', contextResult);
  this.render(hbs`{{player/qz-player contextResult=contextResult}}`);
  var $component = this.$();
  assert.notOk($component.find('.qz-player .qz-viewer .actions-section .previous.btn').length,'Previous button should not appear at the first element');
});

test('Previous button at the second element of a collection', function(assert) {
  const resourceMockA = Ember.Object.create({
    id: '1',
    title: '<p>Resource #1</p>',
    format: 'question',
    'isQuestion': true
  });

  const resourceMockB = ResourceModel.create({id: '2',body:'http://www.water4all.org/us/',isResource: true});

  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    isCollection: true,
    resources: Ember.A([
      resourceMockA,
      resourceMockB
    ])
  });

  const resourceResults = Ember.A([
    ResourceResult.create({ resource: resourceMockA,resourceId:'1' }),
    ResourceResult.create({ resource: resourceMockB,resourceId:'2' })
  ]);

  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    collection,
    context:{id:'context-id',attempts:'2'},
    currentResource:resourceMockB,
    resourceResults
  });
  let resourceResult =  ResourceResult.create({ resource: resourceMockB });

  this.set('resourceResult', resourceResult);
  this.set('contextResult', contextResult);
  this.render(hbs`{{player/qz-player contextResult=contextResult resourceResult=resourceResult}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-player .qz-viewer .actions-section .previous.btn').length,'Previous button should appear');
});

test('Previous button at the first element of the assessment', function(assert) {
  const question1 = ResourceModel.create({
    'id': '569906aacea8416665209d53',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence:1,
    hasAnswers: true
  });

  const question2 =ResourceModel.create({
    'id': '569906aacea8416665209d53',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence:1,
    hasAnswers: true
  });

  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    resources: Ember.A([
      question1,
      question2
    ])
  });

  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    collection,
    context:{id:'context-id',attempts:'2'}
  });
  this.set('contextResult', contextResult);
  this.render(hbs`{{player/qz-player contextResult=contextResult}}`);
  var $component = this.$();
  assert.notOk($component.find('.qz-player .qz-viewer .actions-section .previous.btn').length,'Previous button should not appear at the first element');
});

test('Previous button at the second element of a assessment', function(assert) {
  const question1 = ResourceModel.create({
    'id': '1',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence:1,
    hasAnswers: true
  });

  const question2 =ResourceModel.create({
    'id': '2',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence:1,
    hasAnswers: true
  });

  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    resources: Ember.A([
      question1,
      question2
    ]),
    settings:{
      bidirectional:true
    }
  });

  const resourceResults = Ember.A([
    ResourceResult.create({ resource: question1,resourceId:'1' }),
    ResourceResult.create({ resource: question2,resourceId:'2' })
  ]);

  let contextResult = ContextResult.create(Ember.getOwner(this).ownerInjection(), {
    contextId: 'context',
    collection,
    context:{id:'context-id',attempts:'2'},
    currentResource:question2,
    resourceResults
  });
  let resourceResult =  ResourceResult.create({ resource: question2 });

  this.set('resourceResult', resourceResult);
  this.set('contextResult', contextResult);
  this.render(hbs`{{player/qz-player contextResult=contextResult resourceResult=resourceResult}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-player .qz-viewer .actions-section .previous.btn').length,'Previous button should appear');
});
