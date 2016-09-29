import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import BuilderItem from 'quizzes/models/content/builder/item';
import Course from 'quizzes/models/content/course';
import Unit from 'quizzes/models/content/unit';
import Ember from 'ember';

const unitServiceStub = Ember.Service.extend({

  fetchById(courseId, unitId) {
    if (courseId && unitId) {
      let unit = Unit.create(Ember.getOwner(this).ownerInjection(), {
        bigIdeas: 'Big ideas text',
        essentialQuestions: 'Essential questions text',
        id: unitId,
        title: 'Sample Unit Name'
      });
      return Ember.RSVP.resolve(unit);
    } else {
      return Ember.RSVP.reject('Fetch failed');
    }
  }

});

moduleForComponent('content/courses/edit/gru-accordion-course', 'Integration | Component | content/courses/edit/gru accordion course', {
  integration: true,

  beforeEach: function () {
    this.inject.service('i18n');

    this.register('service:api-sdk/unit', unitServiceStub);
    this.inject.service('api-sdk/unit');
  }
});

test('it renders correctly when there are no units', function (assert) {

  this.set('units', []);
  this.render(hbs`{{content/courses/edit/gru-accordion-course items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  assert.ok($component.length, 'Component');

  const $header = $component.find('> .header');
  const $listContainer = $component.find('> .accordion-course');

  assert.ok($header.length, 'Component header');
  assert.ok($header.find('h2'), 'Header title');
  assert.equal($header.find('h2').text(), this.get('i18n').t('common.builder').string, 'Header title text');
  assert.ok($header.find('.detail'), 'Header detail');
  assert.equal($header.find('.detail > span').text(), this.get('i18n').t('common.add-units').string, 'Header detail text');
  assert.ok($header.find('.detail .actions button.add-unit').length, 'Header, add unit button');

  assert.ok($listContainer.length, 'List container');
  assert.equal($listContainer.find('li').length, 1, 'Default unit');
  assert.ok($listContainer.find('li:eq(0)').hasClass('add-item'), 'Default unit class');
  assert.ok($listContainer.find('li:eq(0)').text(), this.get('i18n').t('common.add-new-unit').string, 'Default unit text');
});

test('it renders correctly when there are 2 or more units', function (assert) {

  this.set('course', Course.create({
    id: 'course-id-123',
    isSorting: false
  }));

  this.set('units', Ember.A([
    BuilderItem.create({
      data: Unit.create(Ember.getOwner(this).ownerInjection(), {
        id: '123',
        sequence: 1,
        title: 'Sample Unit Name'
      })
    }),
    BuilderItem.create({
      data: Unit.create(Ember.getOwner(this).ownerInjection(), {
        id: '456',
        sequence: 2,
        title: 'Sample Unit Name'
      })
    })
  ]));

  this.render(hbs`
    {{content/courses/edit/gru-accordion-course
      model=course
      items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  assert.ok($component.length, 'Component');

  const $header = $component.find('> .header');
  const $listContainer = $component.find('> .accordion-course');

  assert.ok($header.length, 'Component header');
  assert.ok($header.find('h2'), 'Header title');
  assert.equal($header.find('h2').text(), this.get('i18n').t('common.builder').string, 'Header title text');
  assert.ok($header.find('.detail'), 'Header detail');
  assert.equal($header.find('.detail > span').text(), this.get('units.length') + ' ' + this.get('i18n').t('common.unitObj', {count: this.get('units.length')}).string, 'Header detail text');
  assert.ok($header.find('.detail .actions button.add-unit').length, 'Header, add unit button');
  assert.ok($header.find('.detail .actions button.sort-items').length, 'Header, sort units button');

  assert.ok($listContainer.length, 'List container');
  assert.equal($listContainer.find('> li').length, 3, 'Total Units');
  assert.ok($listContainer.find('> li:last-child').hasClass('add-item'), 'Default unit class');
  assert.ok($listContainer.find('> li:last-child').text(), this.get('i18n').t('common.add-new-unit').string, 'Default unit text');
});

test('it allows creating a new unit by clicking on the add button in the header', function (assert) {

  this.set('units', []);
  this.render(hbs`{{content/courses/edit/gru-accordion-course items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  const $listContainer = $component.find('> .accordion-course');
  assert.equal($listContainer.find('> li').length, 1, 'Default unit');

  $component.find('> .header .detail .actions button.add-unit').click();
  assert.equal($listContainer.find('> li').length, 2, 'Add unit');
});

test('it allows creating a new unit by clicking on the add section at the bottom of the list', function (assert) {

  this.set('units', []);
  this.render(hbs`{{content/courses/edit/gru-accordion-course items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  const $listContainer = $component.find('> .accordion-course');
  assert.equal($listContainer.find('> li').length, 1, 'Default unit');

  $listContainer.find('> li:eq(0) a').click();
  assert.equal($listContainer.find('> li').length, 2, 'Add unit');
});

test('it removes a unit that has not yet been saved', function (assert) {

  this.set('units', []);
  this.render(hbs`{{content/courses/edit/gru-accordion-course items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  const $listContainer = $component.find('> .accordion-course');

  $listContainer.find('> li:eq(0) a').click();
  assert.equal($listContainer.find('> li').length, 2, 'Unit added');

  const $newUnit = $listContainer.find('> li.gru-accordion-unit.edit');
  $newUnit.find('.panel-heading .actions button.cancel').click();
  assert.equal($listContainer.find('> li').length, 1, 'Unit removed');
});

test('it offers the ability to reorder the units', function (assert) {

  this.set('course', Course.create({
    id: 'course-id-123',
    isSorting: false
  }));

  this.set('units', Ember.A([
    BuilderItem.create({
      data: Unit.create(Ember.getOwner(this).ownerInjection(), {
        id: '123',
        sequence: 1,
        title: 'Sample Unit Name'
      })
    }),
    BuilderItem.create({
      data: Unit.create(Ember.getOwner(this).ownerInjection(), {
        id: '456',
        sequence: 2,
        title: 'Sample Unit Name'
      })
    })
  ]));

  this.render(hbs`
    {{content/courses/edit/gru-accordion-course
      model=course
      items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  const $accordion = $component.find('> .accordion-course');

  assert.ok($accordion.length, 'Accordion container');
  assert.ok($accordion.hasClass('sortable'), 'Class to enable reordering');
  assert.ok($accordion.hasClass('ui-sortable'), 'Reordering capability installed');
  assert.notOk($accordion.hasClass('sorting'), 'Class when reordering is active is not present');
  assert.notOk($component.find('> .header > .detail .drag-options').length, 'Reorder options not present');

  // Click on reorder button
  $component.find('> .header > .detail > .actions > .sort-items').click();

  assert.ok($accordion.hasClass('sorting'), 'Class when reordering is active is present');
  assert.equal($accordion.find('> li.gru-accordion-unit').length, 2, 'Number of lessons loaded');
  assert.equal($accordion.find('> li.gru-accordion-unit > .panel > .panel-heading > .drag-icon').length, 2, 'Units have drag handles');
  assert.notOk($component.find('> .header > .detail > .actions > .sort-items').length, 'Reorder button is hidden');

  const $dragOptions = $component.find('> .header > .detail .drag-options');
  assert.ok($dragOptions.length, 'Reorder options are present');

  assert.equal($dragOptions.find('button').length, 2, 'Additional buttons when reordering');
  assert.ok($dragOptions.find('button:eq(0)').hasClass('cancel'), 'First button is to cancel reordering');
  assert.ok($dragOptions.find('button:eq(1)').hasClass('save'), 'Second button is to save the new order of units');
});
