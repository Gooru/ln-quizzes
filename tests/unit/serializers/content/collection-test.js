import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import CollectionModel from 'gooru-web/models/content/collection';

moduleFor('serializer:content/collection', 'Unit | Serializer | content/collection');

test('serializeCreateCollection', function(assert) {
  const serializer = this.subject();
  const collectionObject = CollectionModel.create({
    title: 'collection-title',
    learningObjectives: 'any',
    isVisibleOnProfile: true,
    thumbnailUrl: 'http://test-bucket01.s3.amazonaws.com/image-id.png',
    standards: []
  });
  const response = serializer.serializeCreateCollection(collectionObject);
  assert.equal(response.title, 'collection-title', "Wrong title");
  assert.equal(response.learning_objective, 'any', "Wrong learning objective");
  assert.equal(response.visible_on_profile, true, "Wrong visible on profile");
  assert.equal(response.thumbnail, 'image-id.png', "Wrong thumbnail");
  assert.equal(response.taxonomy, null, "Wrong taxonomy object");
});

test('serializeUpdateCollection', function(assert) {
  const serializer = this.subject();
  const collectionObject = CollectionModel.create({
    title: 'collection-title',
    learningObjectives: 'any',
    isVisibleOnProfile: false,
    thumbnailUrl: 'http://test-bucket01.s3.amazonaws.com/image-id.png',
    standards: []
  });
  const response = serializer.serializeUpdateCollection(collectionObject);
  assert.equal(response.title, 'collection-title', "Wrong title");
  assert.equal(response.learning_objective, 'any', "Wrong learning objective");
  assert.equal(response.visible_on_profile, false, "Wrong visible on profile");
  assert.equal(response.thumbnail, 'image-id.png', "Wrong thumbnail");
  assert.equal(response.taxonomy, null, "Wrong taxonomy object");
});

test('serializeUpdateCollection empty learning objectives', function(assert) {
  const serializer = this.subject();
  const collectionObject = CollectionModel.create({
    title: 'collection-title',
    learningObjectives: '',
    isVisibleOnProfile: false,
    thumbnailUrl: 'http://test-bucket01.s3.amazonaws.com/image-id.png',
    standards: []
  });
  const response = serializer.serializeUpdateCollection(collectionObject);
  assert.equal(response.title, 'collection-title', "Wrong title");
  assert.equal(response.learning_objective, null, "Wrong learning objective");
  assert.equal(response.visible_on_profile, false, "Wrong visible on profile");
  assert.equal(response.thumbnail, 'image-id.png', "Wrong thumbnail");
  assert.equal(response.taxonomy, null, "Wrong taxonomy object");
});

test('normalizeReadCollection', function(assert) {
  const serializer = this.subject();
  serializer.set('session', Ember.Object.create({
    'cdnUrls': {
      content: 'http://test-bucket01.s3.amazonaws.com/'
    }
  }));
  const collectionData = {
    id: 'collection-id',
    title: 'collection-title',
    learning_objective: 'learning-objectives',
    visible_on_profile: true,
    thumbnail: 'image-id.png',
    taxonomy: {}
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.equal(collection.get('title'), 'collection-title', 'Wrong title');
  assert.equal(collection.get('thumbnailUrl'), 'http://test-bucket01.s3.amazonaws.com/image-id.png', 'Wrong image');
  assert.equal(collection.get('learningObjectives'), 'learning-objectives', 'Wrong learningObjectives');
  assert.equal(collection.get('isVisibleOnProfile'), true, 'Wrong isVisibleOnProfile');
  assert.equal(collection.get('standards.length'), 0, 'Wrong standards number of elements');
});

test('serializeReorderCollection', function(assert) {
  const serializer = this.subject();
  const ids = ["a", "b", "c"];
  const data = serializer.serializeReorderCollection(ids);
  assert.ok(data.order, 'Missing order');
  assert.equal(data.order.length, 3, 'Wrong order total');
  assert.equal(data.order[0].id, "a", 'Wrong id');
  assert.equal(data.order[0].sequence_id, 1, 'Wrong sequence id');
});

test('normalizeReadCollection - if visible_on_profile is undefined', function(assert) {
  const serializer = this.subject();
  serializer.set('session', Ember.Object.create({
    'cdnUrls': {
      content: 'http://test-bucket01.s3.amazonaws.com/'
    }
  }));
  const collectionData = {
    id: 'collection-id'
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.equal(collection.get('isVisibleOnProfile'), true, 'Wrong isVisibleOnProfile');
});

test('normalizeReadCollection - if it is not visible on profile', function(assert) {
  const serializer = this.subject();
  serializer.set('session', Ember.Object.create({
    'cdnUrls': {
      content: 'http://test-bucket01.s3.amazonaws.com/'
    }
  }));
  const collectionData = {
    id: 'collection-id',
    visible_on_profile: false
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.equal(collection.get('isVisibleOnProfile'), false, 'Wrong isVisibleOnProfile');
});
