import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('content/courses/play/gru-accordion-course', 'Integration | Component | content/courses/play/gru accordion course', {
  integration: true,

  beforeEach: function () {
    this.inject.service('i18n');
  }
});

test('it renders correctly when there are no units', function (assert) {

  this.set('units', []);
  this.render(hbs`{{content/courses/play/gru-accordion-course items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  assert.ok($component.length, 'Component');

  const $listContainer = $component.find('> .accordion-course');

  assert.ok($listContainer.length, 'List container');
  assert.equal($listContainer.find('li').length, 0, 'No units by default');
});

// TODO Fix this test!!
/*
test('it renders correctly when there are 2 or more units', function (assert) {

  this.set('units', Ember.A([
    BuilderItem.create({
      data: Unit.create(Ember.getOwner(this).ownerInjection(), {
        id: '123',
        title: 'Sample Unit Title'
      })
    }),
    BuilderItem.create({
      data: Unit.create(Ember.getOwner(this).ownerInjection(), {
        id: '456',
        title: 'Another Unit Title'
      })
    })
  ]));
  this.set('closeAllUnits', function() {});

  this.render(hbs`{{content/courses/play/gru-accordion-course items=units}}`);

  const $component = this.$('.content.courses.gru-accordion-course.gru-accordion');
  assert.ok($component.length, 'Component');

  const $listContainer = $component.find('> .accordion-course');

  assert.ok($listContainer.length, 'List container');
  assert.equal($listContainer.find('> li').length, 2, 'Total Units');
});
*/


