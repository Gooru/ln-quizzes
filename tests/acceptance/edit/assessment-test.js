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
    assert.ok(Ember.$('section#editor .header h2').length,'Missing editor header title');
    assert.ok(Ember.$('section#editor .panel.assessment-task').length,'Missing assessment task panel');
    assert.ok(Ember.$('section#editor .panel.assessment-task .math-editor .gru-rich-text-editor').length,'Missing math editor');
    assert.ok(Ember.$('section#editor .panel.assessment-task button.add-image').length,'Missing add image button');
    assert.ok(Ember.$('section#editor .panel.assessment-task .submission-format').length,'Missing submission format section');
    assert.ok(Ember.$('section#editor .panel.assessment-task .submission-format h3').length,'Missing submission format title');
    assert.ok(Ember.$('section#editor .panel.assessment-task .submission-format .gru-submission-format').length,'Missing gru-submission-format component');
    var $informationTab = Ember.$('.header.assessment.edit nav a.information');
    click($informationTab);
    andThen(function() {
      assert.ok(Ember.$('section#information').length,'Missing information section');
    });
  });
});
