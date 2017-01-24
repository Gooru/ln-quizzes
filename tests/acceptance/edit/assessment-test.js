import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | edit/assessment',{
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'token-value',
      user: {
        providedAt: Date.now()
      }
    });
  }
});

test('visiting /edit/assessment', function(assert) {
  visit('/edit/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    assert.ok(Ember.$('.header.assessment.edit').length,'Missing assessment edit header');
    assert.ok(Ember.$('.header.assessment.edit h1').length,'Missing header title');
    assert.equal(Ember.$('.header.assessment.edit nav a').length,2,'Should have 2 tabs');
    assert.ok(Ember.$('.header.assessment.edit nav a.information').length,'Missing information tab');
    assert.ok(Ember.$('.header.assessment.edit nav a.editor').length,'Missing editor tab');
    assert.ok(Ember.$('.header.assessment.edit button.delete').length,'Missing delete button');
    assert.ok(Ember.$('.header.assessment.edit button.copy').length,'Missing copy button');
    assert.ok(Ember.$('.header.assessment.edit button.preview').length,'Missing preview button');
    assert.ok(Ember.$('.header.assessment.edit button.settings').length,'Missing settings button');
    assert.ok(Ember.$('.header.assessment.edit button.assign').length,'Missing assign to class button');
    assert.ok(Ember.$('section#editor').length,'Missing editor section');
    assert.ok(Ember.$('section#editor .header').length,'Missing editor header');
    assert.ok(Ember.$('section#editor .header h2').length,'Missing editor header title');
    assert.ok(Ember.$('section#editor .panel.assessment-task').length,'Missing assessment task panel');
    assert.ok(Ember.$('section#editor .panel.assessment-task .math-editor .qz-rich-text-editor').length,'Missing math editor');
    assert.ok(Ember.$('section#editor .panel.assessment-task button.add-image').length,'Missing add image button');
    assert.ok(Ember.$('section#editor .panel.assessment-task .submission-format').length,'Missing submission format section');
    assert.ok(Ember.$('section#editor .panel.assessment-task .submission-format h3').length,'Missing submission format title');
    assert.ok(Ember.$('section#editor .panel.assessment-task .submission-format .qz-submission-format').length,'Missing qz-submission-format component');
    assert.ok(Ember.$('section#editor .panel.rubric-creation').length,'Missing rubric creation panel');
    assert.ok(Ember.$('section#editor .panel.rubric-creation .panel-heading h3').length,'Missing rubric creation title');
    assert.ok(Ember.$('section#editor .panel.rubric-creation .qz-rubric-creation').length,'Missing rubric creation component');
    var $informationTab = Ember.$('.header.assessment.edit nav a.information');
    click($informationTab);
    andThen(function() {
      assert.ok(Ember.$('section#information').length,'Missing information section');
      assert.ok(Ember.$('section#information .header').length,'Missing information header');
      assert.ok(Ember.$('section#information .header h2').length,'Missing information header title');
      assert.ok(Ember.$('section#information .title label .gru-input').length,'Missing assessment title input');
      assert.ok(Ember.$('section#information .learning-objective label .gru-textarea').length,'Missing assessment learning objective');
    });
  });
});
test('visiting /edit/assessment - Add New Category', function(assert) {
  visit('/edit/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    assert.ok(Ember.$('section#editor .qz-category').length,'Missing default category');
    assert.equal(Ember.$('section#editor .qz-category').length,1,'Should have only one category');
    assert.equal(Ember.$('section#editor .qz-category .category .number').text(),'1','Incorrect category number');
    var $addCategory =Ember.$('section#editor .add-category');
    assert.ok($addCategory.length,'Missing add category');
    click($addCategory);
    andThen(function() {
      assert.equal(Ember.$('section#editor .qz-category').length,2,'Should have 2 categories');
      assert.equal(Ember.$('section#editor .qz-category:eq(1) .category .number').text(),'2','Incorrect category number');
      assert.notOk(Ember.$('section#editor .qz-category:eq(1) .qz-scoring-levels').length,'Scoring levels should not appear');
      var $score =Ember.$('section#editor .qz-category:eq(1) .scoring .qz-switch a');
      click($score);
      andThen(function() {
        assert.ok(Ember.$('section#editor .qz-category:eq(1) .qz-scoring-levels').length,'Missing scoring levels');
      });
    });
  });
});

test('visiting /edit/assessment - Delete Category', function(assert) {
  visit('/edit/assessment/assessment-id');

  andThen(function() {
    assert.equal(currentURL(), '/edit/assessment/assessment-id');
    assert.ok(Ember.$('section#editor .qz-category').length,'Missing default category');
    assert.equal(Ember.$('section#editor .qz-category').length,1,'Should have only one category');
    assert.equal(Ember.$('section#editor .qz-category .category .number').text(),'1','Incorrect category number');
    var $addCategory =Ember.$('section#editor .add-category');
    assert.ok($addCategory.length,'Missing add category');
    click($addCategory);
    andThen(function() {
      assert.equal(Ember.$('section#editor .qz-category').length,2,'Should have 2 categories');
      var category = Ember.$('section#editor .qz-category:eq(1)');
      click(category.find('.panel-footer .actions .btn.delete'));
      andThen(function() {
        assert.equal(Ember.$('section#editor .qz-category').length,1,'Should have 2 categories');
      });
    });
  });
});
