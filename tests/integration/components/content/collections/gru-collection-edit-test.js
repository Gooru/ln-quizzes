import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Collection from 'gooru-web/models/content/collection';
import Course from 'gooru-web/models/content/course';

const taxonomyServiceStub = Ember.Service.extend({

  getSubjects(category) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!category) {
        reject({status: 500});
      } else {
        resolve({
          "subjects": [{
            "id": "GDF.K12.CS",
            "title": "Computer Science",
            "description": null,
            "code": "GDF.K12.CS",
            "standard_framework_id": "GDF"
          }]
        });
      }
    });
  }

});

moduleForComponent('content/collections/gru-collection-edit', 'Integration | Component | content/collections/gru collection edit', {
  integration: true,
  beforeEach: function () {
    this.i18n = this.container.lookup('service:i18n');
    this.i18n.set("locale","en");
    this.register('service:api-sdk/taxonomy', taxonomyServiceStub);
    this.inject.service('api-sdk/taxonomy');
  }
});

test('it has header and main sections', function (assert) {

  var collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: "Collection Title"
  });

  this.set('collection', collection);
  this.render(hbs`{{content/collections/gru-collection-edit collection=collection}}`);

  var $container = this.$("article.content.collections.gru-collection-edit");
  assert.ok($container.length, "Component");

  const $header = $container.find('> header');
  assert.ok($header.length, "Header");
  assert.ok($header.find('> .actions').length, "Header actions");
  assert.equal($header.find('> .actions > button').length, 5, "Number of header actions");
  assert.ok($header.find('> nav').length, "Header navigation");
  assert.equal($header.find('> nav > a').length, 3, "Number of header navigation links");
  assert.notOk($header.find('.back-to').length, "Should don't have the option Back to course");

  assert.equal($container.find('> section').length, 3, "Number of edit sections");
  assert.ok($container.find('> section#information').length, "Information section");
  assert.ok($container.find('> section#builder').length, "Builder section");
  assert.ok($container.find('> section#settings').length, "Settings section");
});

test('Header when comes from content builder', function (assert) {

  var collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: "Collection Title"
  });

  var course = Course.create(Ember.getOwner(this).ownerInjection(), {
    title: "Course Title",
    id:"123445566"
  });

  this.set('collection', collection);
  this.set('course',course);

  this.render(hbs`{{content/collections/gru-collection-edit allowBack=true collection=collection course=course}}`);

  var $container = this.$("article.content.collections.gru-collection-edit");
  assert.ok($container.length, "Component");

  const $header = $container.find('> header');
  assert.ok($header.length, "Header");
  assert.ok($header.find('.back-to').length, "Should have the option Back to course");

});
