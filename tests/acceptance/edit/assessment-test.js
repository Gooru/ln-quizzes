import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | edit/assessment');

test('visiting /edit/assessment', function(assert) {
  visit('/edit/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    assert.ok(find('.header.assessment.edit').length,'Missing assessment edit header');
    assert.ok(find('.header.assessment.edit h1').length,'Missing header title');
    assert.equal(find('.header.assessment.edit nav a').length,3,'Should have 3 tabs');
    assert.ok(find('.header.assessment.edit nav a.information').length,'Missing information tab');
    assert.ok(find('.header.assessment.edit nav a.prompt').length,'Missing prompt tab');
    assert.ok(find('.header.assessment.edit nav a.rubric').length,'Missing rubric tab');
    assert.ok(find('.header.assessment.edit button.delete').length,'Missing delete button');
    assert.ok(find('.header.assessment.edit button.copy').length,'Missing copy button');
    assert.ok(find('.header.assessment.edit button.preview').length,'Missing preview button');
    assert.ok(find('.header.assessment.edit button.settings').length,'Missing settings button');
    assert.ok(find('.header.assessment.edit button.assign').length,'Missing assign to class button');
    assert.ok(find('.qz-fixed-footer').length,'Fixed footer');
    assert.ok(find('section#prompt').length,'Missing prompt section');
    assert.ok(find('section#prompt .header').length,'Missing prompt header');
    assert.ok(find('section#prompt .header h2').length,'Missing editor header title');
    assert.ok(find('section#prompt .panel.assessment-task').length,'Missing assessment task panel');
    assert.ok(find('section#prompt .panel.assessment-task .math-editor .qz-rich-text-editor').length,'Missing math editor');
    assert.ok(find('section#prompt .panel.assessment-task button.add-image').length,'Missing add image button');
    assert.ok(find('section#prompt .panel.assessment-task .submission-format').length,'Missing submission format section');
    assert.ok(find('section#prompt .panel.assessment-task .submission-format h3').length,'Missing submission format title');
    assert.ok(find('section#prompt .panel.assessment-task .submission-format .qz-submission-format').length,'Missing qz-submission-format component');
    var $rubricTab = find('.header.assessment.edit nav a.rubric');
    click($rubricTab);
    andThen(function() {
      assert.ok(find('section#rubric .panel.rubric-creation').length,'Missing rubric creation panel');
      assert.ok(find('section#rubric .panel.rubric-creation .panel-heading h3').length,'Missing rubric creation title');
      assert.ok(find('section#rubric .panel.rubric-creation .qz-rubric-creation').length,'Missing rubric creation component');
      var $informationTab = find('.header.assessment.edit nav a.information');
      click($informationTab);
      andThen(function() {
        assert.ok(find('section#information').length,'Missing information section');
        assert.ok(find('section#information .header').length,'Missing information header');
        assert.ok(find('section#information .header h2').length,'Missing information header title');
        assert.ok(find('section#information .title label .gru-input').length,'Missing assessment title input');
        assert.ok(find('section#information .learning-objective label .gru-textarea').length,'Missing assessment learning objective');
      });
    });
  });
});
test('visiting /edit/assessment - Add New Category', function(assert) {
  visit('/edit/assessment/assessment-id');
  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    var $rubricTab = find('.header.assessment.edit nav a.rubric');
    click($rubricTab);
    andThen(function() {
      assert.notOk(find('section#rubric .qz-category').length,'Should not have default category');
      var $addCategory =find('section#rubric .add-category');
      assert.ok($addCategory.length,'Missing add category');
      click($addCategory);
      andThen(function() {
        assert.equal(find('section#rubric .qz-category').length,1,'Should have 1 category');
        assert.equal(find('section#rubric .qz-category:eq(0) .category .number').text(),'1','Incorrect category number');
        assert.notOk(find('section#rubric .qz-category:eq(0) .qz-scoring-levels').length,'Scoring levels should not appear');
        var $score =find('section#rubric .qz-category:eq(0) .scoring .qz-switch a');
        click($score);
        andThen(function() {
          assert.ok(find('section#rubric .qz-category:eq(0) .qz-scoring-levels').length,'Missing scoring levels');
        });
      });
    });
  });
});

test('visiting /edit/assessment - Delete Category', function(assert) {
  visit('/edit/assessment/assessment-id');
  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    var $rubricTab = find('.header.assessment.edit nav a.rubric');
    click($rubricTab);
    andThen(function() {
      assert.notOk(find('section#rubric .qz-category').length,'Should not have categories');
      var $addCategory =find('section#rubric .add-category');
      assert.ok($addCategory.length,'Missing add category');
      click($addCategory);
      andThen(function() {
        assert.equal(find('section#rubric .qz-category').length,1,'Should have 1 category');
        var category = find('section#rubric .qz-category:eq(0)');
        click(category.find('.panel-footer .actions .btn.delete'));
        andThen(function() {
          assert.equal(find('section#rubric .qz-category').length,0,'Should not have categories');
        });
      });
    });
  });
});
test('visiting /edit/assessment - Copy Category', function(assert) {
  visit('/edit/assessment/assessment-id');
  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    var $rubricTab = find('.header.assessment.edit nav a.rubric');
    click($rubricTab);
    andThen(function() {
      var $addCategory = find('section#rubric .add-category');
      assert.ok($addCategory.length,'Missing add category');
      click($addCategory);
      andThen(function() {
        assert.equal(find('section#rubric .qz-category').length,1,'Should have 1 category');
        var category = find('section#rubric .qz-category:eq(0)');
        fillIn(category.find('.title input'), 'Category title for test');
        click(category.find('.panel-footer .actions .btn.copy'));
        andThen(function() {
          assert.equal(find('section#rubric .qz-category').length,2,'Should have 2 categories');
          assert.equal(category.find('.category .number').text(),'1','Incorrect category 1 number');
          assert.equal(category.find('.category .title input').val(),'Category title for test','Incorrect category 1 title');
          assert.equal(find('section#rubric .qz-category:eq(1) .category .number').text(),'2','Incorrect category 2 number');
        });
      });
    });
  });
});
test('visiting /edit/assessment - Overall Score', function(assert) {
  visit('/edit/assessment/assessment-id');
  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    var $rubricTab = find('.header.assessment.edit nav a.rubric');
    click($rubricTab);
    andThen(function() {
      assert.ok(find('.editor.assessment.qz-assessment .overall-score').length,'Missing overall score panel');
      assert.ok(find('.editor.assessment.qz-assessment .overall-score .panel-heading h3').length,'Missing overall score title');
      assert.ok(find('.editor.assessment.qz-assessment .overall-score .panel-body .feedback label span').length,'Missing Feedback guidance label');
      assert.ok(find('.editor.assessment.qz-assessment .overall-score .panel-body .feedback label .gru-textarea').length,'Missing Feedback guidance textarea');
      assert.ok(find('.editor.assessment.qz-assessment .overall-score .panel-body .total-points').length,'Missing total points');
      assert.ok(find('.editor.assessment.qz-assessment .overall-score .panel-body .required-feedback span').length,'Missing required feedback checkbox');
    });
  });
});
