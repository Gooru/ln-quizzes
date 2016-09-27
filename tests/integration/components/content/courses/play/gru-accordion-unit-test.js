import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import BuilderItem from 'gooru-web/models/content/builder/item';
import Course from 'gooru-web/models/content/course';
import Lesson from 'gooru-web/models/content/lesson';
import Unit from 'gooru-web/models/content/unit';
import Ember from 'ember';

const unitServiceStub = Ember.Service.extend({

  fetchById(courseId, unitId) {
    if (courseId && unitId) {
      let unit = Unit.create(Ember.getOwner(this).ownerInjection(), {
        bigIdeas: 'Big ideas text',
        essentialQuestions: 'Essential questions text',
        id: '123',
        title: 'Sample Unit Name',
        children: [
          Lesson.create(Ember.getOwner(this).ownerInjection(), {
            id: 'lesson-123',
            sequence: 1,
            title: 'Lesson Title A'
          }),
          Lesson.create(Ember.getOwner(this).ownerInjection(), {
            id: 'lesson-456',
            sequence: 2,
            title: 'Lesson Title B'
          })
        ]
      });
      return Ember.RSVP.resolve(unit);
    } else {
      return Ember.RSVP.reject('Fetch failed');
    }
  }
});

const lessonServiceStub = Ember.Service.extend({

  fetchById(courseId, unitId, lessonId) {
    if (courseId && unitId && lessonId) {
      let lesson = Lesson.create(Ember.getOwner(this).ownerInjection(), {
        id: '123',
        sequence: 1,
        taxonomy: [],
        title: 'Sample Lesson Name',
        children: []
      });
      return Ember.RSVP.resolve(lesson);
    } else {
      return Ember.RSVP.reject('Fetch failed');
    }
  }

});


moduleForComponent('content/courses/play/gru-accordion-unit', 'Integration | Component | content/courses/play/gru accordion unit', {
  integration: true,

  beforeEach: function () {
    this.inject.service('i18n');

    this.register('service:api-sdk/unit', unitServiceStub);
    this.register('service:api-sdk/lesson', lessonServiceStub);
  }
});

test('it renders the unit correctly, if the unit has no lessons', function (assert) {

  const unit = BuilderItem.create({
    data: Unit.create(Ember.getOwner(this).ownerInjection(), {
      id: '123',
      title: 'Sample Unit Name'
    }),
    isEditing: false
  });

  this.set('index', 0);
  this.set('unit', unit);
  this.set('onExpandUnit', function() {
    assert.ok(true, 'Called onExpandUnit');
  });
  this.render(hbs`{{content/courses/play/gru-accordion-unit model=unit index=index onExpandUnit=onExpandUnit}}`);

  const $component = this.$('.content.courses.gru-accordion.gru-accordion-unit.view');
  assert.ok($component.length, 'Component');

  const $heading = $component.find('.view .panel-heading');
  assert.equal($heading.find('h3').text(), this.get('i18n').t('common.unit').string + " " + (this.get('index') + 1), 'Header prefix');
  assert.ok($heading.find('strong').text(), unit.get('title'), 'Unit title');
  assert.equal($heading.find('.detail > span').text(), '0 ' + this.get('i18n').t('common.lessonObj', { count: 0}).string, 'Lesson text');

  const $lessonList = $component.find('.view .panel-body ol.accordion-unit');
  assert.ok($lessonList.length, 'Lesson list');
  assert.equal($lessonList.find('li.lesson').length, 0, 'No lessons by default');
});



test('first unit should be expanded', function (assert) {

  const unit = BuilderItem.create({
    data: Unit.create(Ember.getOwner(this).ownerInjection(), {
      id: '123'
    }),
    isEditing: false,
    isExpanded: false
  });

  this.on('externalAction', function () {
    assert.ok(true);
  });

  this.set('course', Course.create({
    id: 'course-id-123'
  }));
  this.set('unit', unit);
  this.render(hbs`
    {{content/courses/play/gru-accordion-unit
      course=course
      model=unit
      index=0
      onExpandUnit=(action 'externalAction') }}
    `);

  const $container = this.$('.content.courses.gru-accordion.gru-accordion-unit > .view');
  assert.ok($container.length, 'Container');
  assert.ok($container.hasClass('collapsed'), 'First unit should not be expanded');
});

test('it expands/collapses the unit', function (assert) {

  const unit = BuilderItem.create({
    data: Unit.create(Ember.getOwner(this).ownerInjection(), {
      id: '123'
    }),
    isEditing: false,
    isExpanded: false
  });

  this.on('externalAction', function () {
    assert.ok(true);
  });

  this.set('course', Course.create({
    id: 'course-id-123'
  }));
  this.set('unit', unit);
  this.render(hbs`
    {{content/courses/play/gru-accordion-unit
      course=course
      model=unit
      index=0
      onExpandUnit=(action 'externalAction') }}
    `);

  const $container = this.$('.content.courses.gru-accordion.gru-accordion-unit > .view');
  assert.ok($container.length, 'Container');
  assert.ok($container.hasClass('collapsed'), 'Container should not be expanded');


  $container.find('> .panel-heading > h3 > a').click();
  assert.ok($container.hasClass('expanded'), 'Container collapsed after clicking header prefix');


  $container.find('> .panel-heading > strong > a').click();
  assert.ok($container.hasClass('collapsed'), 'Container expanded after clicking header title');


  $container.find('> .panel-heading > strong > a').click();
  assert.ok($container.hasClass('expanded'), 'Container collapsed after clicking header title');
});
