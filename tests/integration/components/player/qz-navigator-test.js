import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import QuestionResult from 'quizzes-addon/models/result/question';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player/qz-navigator', 'Integration | Component | player/qz navigator', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set('locale','en');
  }
});

test('Player Navigator', function(assert) {

  assert.expect(9);

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

  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    resources: Ember.A([
      resourceMockA,
      resourceMockB
    ]),
    lastVisitedResource: resourceMockB,
    getResourceById: function(id){
      if(id === '1'){
        return resourceMockA;
      } else if (id ==='2') {
        return resourceMockB;
      }
    }
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('collection', collectionMock);
  this.set('resourceResults', resourceResults);

  this.on('itemSelected', function(/*resource*/) {
    assert.ok(false, 'This should not be called');
  });

  this.render(hbs`{{player.qz-navigator collection=collection
      resourceResults=resourceResults lessonTitle='E-Lesson1'
      selectedResourceId='1' onItemSelected='itemSelected'}}`);

  var $component = this.$(); //component dom element
  const $navigator = $component.find('.qz-navigator');
  T.exists(assert, $navigator, 'Missing navigator section');

  //$navigatorHeader
  const $navigatorHeader = $component.find('.qz-navigator .navigator-header');
  T.exists(assert, $navigatorHeader.find('.collection-type'), 'Missing collection type');
  T.exists(assert, $navigatorHeader.find('.collection-title'), 'Missing collection title');

  //$collectionResources list
  const $collectionResources = $navigator.find('.resources');
  T.exists(assert, $collectionResources, 'Missing collection resources');
  const $resourceItems = $collectionResources.find('li.list-group-item');
  assert.equal($resourceItems.length, 2, 'Missing resources with list-group-item class');
  const $firstResourceItem = $collectionResources.find('li.list-group-item:eq(0)');
  T.exists(assert, $firstResourceItem.find('.resources-info'), 'Missing resources info');
  T.exists(assert, $firstResourceItem.find('.resources-info .bubble-type.question'), 'Missing question class type');
  assert.equal(T.text($firstResourceItem.find('.resources-info .title.visible-sm')), 'Resource #1', 'Wrong item text');

  //$resourceItem Selected
  let $selected = $navigator.find('.list-group-item:eq(0).selected');
  T.exists(assert, $selected, 'Incorrect selected resource 1');


});

test('Layout when navigator is closed', function(assert) {
  assert.expect(2);

  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/qz-navigator onCloseNavigator='parentAction' lessonTitle='E-Lesson1'}}`);
  var $component = this.$(); //component dom element
  var $menuButton = $component.find('.hamburger-icon');

  assert.ok($menuButton, 'Missing menu button');
  $menuButton.click();

});

test('it allows navigation between resource links -by default', function(assert) {

  assert.expect(3);
  var selectCtr = 0;

  const resourceMockA = Ember.Object.create({
    id: '1',
    title: 'Resource #1'
  });

  const resourceMockB = Ember.Object.create({
    id: '2',
    title: 'Resource #2'
  });

  const collectionMock = Ember.Object.create({
    id: 'collection-id',
    resources: Ember.A([
      resourceMockA,
      resourceMockB
    ]),
    getResourceById: function(id){
      if (id === '1') {
        return resourceMockA;
      } else {
        return resourceMockB;
      }
    }
  });

  this.on('externalAction', function(item) {
    if (selectCtr === 0) {
      assert.equal(item.get('id'), '2', 'Resource item selected');
    } else {
      assert.equal(item.get('id'), '1', 'Resource item selected');
    }
    selectCtr += 1;
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('resourceResults', resourceResults);
  this.set('collection', collectionMock);

  this.render(hbs`
    {{player.qz-navigator
      resourceResults=resourceResults
      onItemSelected='externalAction'
      collection=collection
      selectedResourceId='1'}}`);

  const $component = this.$('.qz-navigator');
  assert.ok($component.find('.list-group-item:eq(0).selected').length, 'First item selected');

  // Click on the second resource
  $component.find('.list-group-item:eq(1)').click();

  // Click on the first resource
  $component.find('.list-group-item:eq(0)').click();
});

test('resource link navigation is disabled', function(assert) {

  assert.expect(0);

  const resourceMockA = Ember.Object.create({
    id: '1',
    title: 'Resource #1'
  });

  const resourceMockB = Ember.Object.create({
    id: '2',
    title: 'Resource #2'
  });

  const collectionMock = Ember.Object.create({
    id: 'collection-id',
    resources: Ember.A([
      resourceMockA,
      resourceMockB
    ]),
    getResourceById: function(id){
      if (id === '1') {
        return resourceMockA;
      } else {
        return resourceMockB;
      }
    }
  });

  this.on('externalAction', function() {
    assert.notOk(true, 'Resource item selected');
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('resourceResults', resourceResults);
  this.set('collection', collectionMock);

  this.render(hbs`
    {{player.qz-navigator
      isNavigationDisabled=true
      resourceResults=resourceResults
      onItemSelected='externalAction'
      collection=collection
      selectedResourceId='1'}}`);

  const $component = this.$('.qz-navigator');

  // Click on the second resource
  $component.find('.list-group-item:eq(1)').click();

  // Click on the first resource
  $component.find('.list-group-item:eq(0)').click();

});

test('See usage report', function(assert) {
  assert.expect(2);

  const collection = Ember.Object.create({
    isCollection: true
  });

  this.set('collection', collection);
  this.on('parentAction', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/qz-navigator collection=collection onFinishCollection='parentAction' lessonTitle='E-Lesson1'}}`);
  var $component = this.$(); //component dom element
  var $seeReportButton = $component.find('.qz-navigator .see-usage-report');
  assert.ok($seeReportButton.length, 'Missing button');
  $seeReportButton.click();
});

test('Finish collection', function(assert) {
  assert.expect(2);

  const collection = Ember.Object.create({
    isAssessment: true
  });

  this.set('collection', collection);

  this.on('onFinishCollection', function(){
    assert.ok(true, 'external Action was called!');
  });

  this.render(hbs`{{player/qz-navigator onFinishCollection='onFinishCollection' submitted=false collection=collection}}`);
  var $component = this.$(); //component dom element
  var $finishButton = $component.find('button.finish-collection');

  assert.ok($finishButton, 'Missing finish button');
  $finishButton.click();
});
