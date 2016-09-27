import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import wait from 'ember-test-helpers/wait';
import ClassModel from 'gooru-web/models/content/class';

moduleForComponent('gru-header', 'Integration | Component | Header', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
  }
});

test('header layout', function(assert) {
  assert.expect(8); //making sure all asserts are called

  this.set('session', Ember.Object.create({isAnonymous: true}));

  this.on('myAuthenticateAction', function() {
    assert.ok(false, "onAuthenticateAction should not be called");
  });

  this.render(hbs`{{gru-header session=session onAuthenticateAction='myAuthenticateAction'}}`);

  var $component = this.$(); //component dom element

  T.exists(assert, $component.find("header.gru-header"), "Root element not found");

  var $navHeader = $component.find(".navbar-header");
  T.exists(assert, $navHeader, "Missing nav header");
  T.exists(assert, $navHeader.find(".home-link"), "Missing home link");

  var $navSearch = $component.find(".search-navbar-form");
  T.exists(assert, $navSearch, "Missing nav search form");
  T.exists(assert, $navSearch.find(".search-input"), "Missing search input");

  var $navMenu = $component.find(".menu-navbar");
  T.notExists(assert, $navMenu.find(".home-link"), "Link should be available for authenticated users only");
  T.exists(assert, $navMenu.find(".sign-up-button"), "Missing sign up button");
  T.notExists(assert, $navMenu.find(".user-logged"), "User info should not be present");

});

test('header layout with user', function(assert) {
  assert.expect(5); //making sure all asserts are called

  this.set('session', Ember.Object.create({
    isAnonymous: false,
    userData: {username: 'jperez'}
  }));

  this.set('classes', [
      ClassModel.create({
        id: 'id-1',
        title: 'title-1'
      }),
      ClassModel.create({
        id: 'id-2',
        title: 'title-2'
      })
    ]);

  this.render(hbs`{{gru-header session=session classes=classes}}`);

  const $component = this.$(); //component dom element

  const $navMenu = $component.find(".menu-navbar");
  T.notExists(assert, $component.find(".sign-in-button"), "Missing sign-in-btn button");
  T.exists(assert, $navMenu.find("li.my-classes"), "My classes dropdown must be present");
  assert.equal($navMenu.find("li.my-classes ul li").length, 3, "Two classes must be present on classes list and link to create class");
  T.exists(assert, $navMenu.find(".profile .username"), "User info should not be present");
  assert.equal(T.text($navMenu.find(".profile .username")), "jperez", "Wrong username");

});

test('Do search by clicking search button', function(assert) {
  assert.expect(3); //making sure all asserts are called

  this.on('mySearchAction', function(term){
    assert.equal(term, "test", "onSearchAction should be called once");
  });

  this.render(hbs`{{gru-header user=myUser onSearch='mySearchAction'}}`);

  const $component = this.$(); //component dom element

  const $navSearch = $component.find(".search-navbar-form");
  T.exists(assert, $navSearch, "Missing nav search form");
  T.exists(assert, $navSearch.find(".search-input"), "Missing search input");

  const $searchInput = $navSearch.find(".search-input");
  $searchInput.val("test");
  $searchInput.change();
  this.$('form').submit();
});


test('Do search by hitting Enter', function(assert) {

  assert.expect(1); //making sure all asserts are called

  const ANY_TERM = 'any term';

  this.on('searchAction', function(term){
    assert.equal(term, ANY_TERM, 'onSearchAction should be called once');
  });

  this.render(hbs`{{gru-header onSearch='searchAction'}}`);

  var $searchInput = this.$('.search-input');
  $searchInput.val(ANY_TERM);
  $searchInput.change();
  this.$('form').submit();
});

test('Do search with a blank space', function(assert) {
  assert.expect(1);
  const ANY_TERM = ' ';
  this.render(hbs`{{gru-header onSearch='searchAction'}}`);
  var $searchInput = this.$('.search-input');
  $searchInput.val(ANY_TERM);
  $searchInput.change();
  this.$('form').submit();
  T.notExists(assert,this.$(".results"), "Result of search should not appear");
});


test('Search terms under 3 letters', function(assert) {
  assert.expect(1); //making sure all asserts are called

  this.render(hbs`{{gru-header}}`);

  const $component = this.$(); //component dom element

  const $navSearch = $component.find(".search-navbar-form");
  const $searchInput = $navSearch.find(".search-input");
  $searchInput.val("te");
  $searchInput.blur();

  return wait().then(function () {
    T.exists(assert, $navSearch.find(".error"), "error message should be visible");
  });
});
