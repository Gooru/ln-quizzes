import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import T from 'quizzes/tests/helpers/assert';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | search/collections', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'collections-token',
      user: {
        gooruUId: 'collections-token-user-id'
      }
    });
  }
});

test('Layout', function(assert) {
  assert.expect(4); //making sure all asserts are called
  visit('/search/collections?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/collections?term=any');
    T.exists(assert, find(".gru-taxonomy-tag-list"), "Missing gru-taxonomy-tag-list");
    T.exists(assert, find(".collection-results"), "Missing collection-results");
    assert.equal(find(".gru-header .search-input").val(), "any", "Wrong input value");
  });
});


test('Changing term should filter the current result without changing the root url', function(assert) {
  assert.expect(2); //making sure all asserts are called
  visit('/search/collections?term=any');
  andThen(function() {
    assert.equal(currentURL(), '/search/collections?term=any');

    const $appHeader = find('.gru-header');
    const $searchInput = find(".gru-header .search-input");

    fillIn($searchInput, 'europe');
    $searchInput.val('europe');
    $searchInput.change();
    $appHeader.find('form').submit();
    andThen(function(){
      assert.equal(currentURL(), '/search/collections?term=europe');
    });
  });
});


test('onOpenContentPlayer: When opening a collection', function(assert) {
  assert.expect(2);
  visit('/search/collections?term=any');
  andThen(function() {
    const $firstCollectionLink = find(".results div:eq(0) .collection-info a");
    T.exists(assert, $firstCollectionLink, "Missing collection link");
    click($firstCollectionLink); //clicking first collection title
    andThen(function() {
      assert.equal(currentURL(), '/player/all-resource-types-collection-id?resourceId=image-resource-id&type=collection');
    });
  });
});

test('No results found', function(assert) {
  assert.expect(5);
  visit('/search/collections?term=noResultFound');
  andThen(function() {
    const $collectionsButton = find(".content-navigation .category-options .collections");
    T.exists(assert, $collectionsButton, "Missing assessment filter button");
    click($collectionsButton); //clicking first collection title
    andThen(function() {
      assert.equal(currentURL(), '/search/collections?term=noResultFound');
      const $noResultFound = find(".results div.no-results-found");
      T.exists(assert, $noResultFound.find(".title"), "Missing no result found title");
      T.exists(assert, $noResultFound.find("i.remove_circle_outline"), "Missing no result found icon");
      T.exists(assert, $noResultFound.find(".message"), "Missing no result found message");
    });
  });
});

test('Apply taxonomy filter', function(assert) {
  visit('/search/collections?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any');

  andThen(function() {
    assert.equal(currentURL(), '/search/collections?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any');

    assert.equal(find(".gru-taxonomy-tag-list .gru-taxonomy-tag").length, 2, "Number of tags rendered");
  });
});

test('Apply taxonomy filter - Removing taxonomy tag', function(assert) {
  visit('/search/collections?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any');

  andThen(function() {
    assert.equal(currentURL(), '/search/collections?taxonomies=["TEKS.K12.SC-K-SIR-01","TEKS.K12.SC-K-SIR-02"]&term=any');

    const $taxonomyTags = find(".gru-taxonomy-tag-list .gru-taxonomy-tag");

    assert.equal($taxonomyTags.length, 2, "Number of tags rendered");

    $taxonomyTags.eq(0).find("button.remove").click();

    andThen(function() {
      const $taxonomyTags = find(".gru-taxonomy-tag-list .gru-taxonomy-tag");

      assert.equal($taxonomyTags.length, 1, "One tag should be removed");
    });
  });
});
