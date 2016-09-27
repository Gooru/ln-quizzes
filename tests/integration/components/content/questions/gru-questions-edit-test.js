import { moduleForComponent, test } from 'ember-qunit';
import { QUESTION_TYPES } from 'gooru-web/config/question';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Question from 'gooru-web/models/content/question';
import Answer from 'gooru-web/models/content/answer';
import Assessment from 'gooru-web/models/content/assessment';
import Collection from 'gooru-web/models/content/collection';
import Ember from 'ember';

const questionServiceStub = Ember.Service.extend({

  updateQuestion(questionID, editedQuestion) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (questionID === 'question-id-fail' || !editedQuestion) {
        reject({status: 500});
      } else {
        resolve(editedQuestion);
      }
    });
  }

});

const taxonomyServiceStub = Ember.Service.extend({

  getSubjects() {
    return Ember.RSVP.resolve({
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

moduleForComponent('content/questions/gru-questions-edit', 'Integration | Component | content/questions/gru questions edit', {
  integration: true,
  beforeEach: function () {
    this.i18n = this.container.lookup('service:i18n');
    this.i18n.set("locale","en");
    this.register('service:api-sdk/question', questionServiceStub);
    this.inject.service('api-sdk/question');
    this.register('service:taxonomy', taxonomyServiceStub);
    this.inject.service('taxonomy');
  }
});

test('it has header and main sections', function (assert) {

  var question = Ember.Object.create(Ember.getOwner(this).ownerInjection(), {
    title: "Question Title",
    standards: []
  });

  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);

  var $container = this.$("article.content.questions.gru-questions-edit");
  assert.ok($container.length, "Component");

  return wait().then(function () {
    const $header = $container.find('> header');
    assert.ok($header.length, "Header");
    assert.ok($header.find('> .actions').length, "Header actions");
    assert.equal($header.find('> .actions > button').length, 4, "Number of header actions");
    assert.ok($container.find('.actions button.delete').length, "Missing Delete Button");
    assert.ok($container.find('.actions button.gru-share-pop-over').length, "Missing Share Button");
    assert.ok($container.find('.actions button.copy').length, "Missing Copy To Button");
    assert.ok($container.find('.actions button.preview').length, "Missing preview Button");

    assert.ok($header.find('> nav').length, "Header navigation");
    assert.equal($header.find('> nav > a').length, 3, "Number of header navigation links");
    assert.notOk($header.find('.back-to').length, "Should not have the option Back to Assessment");

    assert.equal($container.find('> section').length, 3, "Number of edit sections");
    assert.ok($container.find('> section#information').length, "Information section");
    assert.ok($container.find('> section#builder').length, "Builder section");
    assert.ok($container.find('> section#settings').length, "Settings section");
  });
});

test('Header return to an assessment', function (assert) {


  var assessment = Assessment.create(Ember.getOwner(this).ownerInjection(), {
    title: "Assessment Title",
    id:"123445566"
  });
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    standards: []
  });

  this.set('question', question);
  this.set('assessment', assessment);

  this.render(hbs`{{content/questions/gru-questions-edit question=question collection=assessment isCollection=false}}`);

  var $container = this.$("article.content.questions.gru-questions-edit");
  assert.ok($container.length, "Component");

  return wait().then(function () {
    const $header = $container.find('> header');
    assert.ok($header.length, "Header");
    assert.ok($header.find('.back-to .return-assessment').length, "Should have the option Back to Assessment");
  });
});

test('Header return to an assessment', function (assert) {


  var collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: "Assessment Title",
    id:"123445566"
  });
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    standards: []
  });

  this.set('question', question);
  this.set('collection', collection);

  this.render(hbs`{{content/questions/gru-questions-edit question=question collection=collection isCollection=true}}`);

  var $container = this.$("article.content.questions.gru-questions-edit");
  assert.ok($container.length, "Component");

  return wait().then(function () {
    const $header = $container.find('> header');
    assert.ok($header.length, "Header");
    assert.ok($header.find('.back-to .return-collection').length, "Should have the option Back to Assessment");
  });
});

test('Update Question Information', function (assert) {
  assert.expect(1);
  var newTitle ='Question for testing gooru';
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "Question description",
    standards: []
  });
  this.set('question',question);

  this.render(hbs`{{content/questions/gru-questions-edit isEditing=true question=question tempQuestion=question}}`);

  const $component = this.$('.gru-questions-edit');
  const $titleField = $component.find(".gru-input.title");

  $titleField.find("input").val(newTitle);
  $titleField.find("input").trigger('blur');

  const $save =  $component.find("#information .actions .save");
  $save.click();
  return wait().then(function () {
    assert.equal($component.find(".title label b").text(),newTitle , "The question title should be updated");
  });

});

test('Layout of the information section', function (assert) {
  var question = Ember.Object.create(Ember.getOwner(this).ownerInjection(), {
    title: "Question Title",
    standards: []
  });

  this.set('question', question);
  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);

  return wait().then(function () {
    var $settingsSection = this.$("#information");
    assert.ok($settingsSection.find('.header h2').length, "Information title missing");
    assert.ok($settingsSection.find('.panel-body .title label b').length, "Missing title label");
    assert.ok($settingsSection.find('.panel-body .question-types').length, "Missing question types");
  });
});

test('Layout of the information section editing mode', function (assert) {
  var question = Ember.Object.create(Ember.getOwner(this).ownerInjection(), {
    title: "Question Title",
    standards: []
  });

  this.set('question', question);
  this.render(hbs`{{content/questions/gru-questions-edit isEditing=true question=question tempQuestion=question}}`);

  return wait().then(function () {
    var $settingsSection = this.$("#information");
    assert.ok($settingsSection.find('.header h2').length, "Information title missing");
    assert.ok($settingsSection.find('.panel-body .title label .gru-input').length, "Missing title input");
    // assert.ok($settingsSection.find('.panel-body .question-types .btn-group .dropdown-toggle').length, "Missing question types dropdown");
  });
});

test('Validate if the question title field is left blank', function (assert) {
  assert.expect(3);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: null,
    standards: []
  });
  this.set('question',question);
  this.render(hbs`{{content/questions/gru-questions-edit isEditing=true question=question tempQuestion=question}}`);

  const $component = this.$('.gru-questions-edit');
  const $titleField = $component.find(".gru-input.title");

  assert.ok(!$titleField.find(".error-messages .error").length, 'Title error message not visible');

  $titleField.find("input").trigger('blur');

  return wait().then(function () {
    assert.ok($titleField.find(".error-messages .error").length, 'Title error should be visible');
    $titleField.find("input").val('Question Name');

    $titleField.find("input").trigger('blur');

    return wait().then(function () {
      assert.ok(!$titleField.find(".error-messages .error").length, 'Title error message was hidden');
    });
  });
});

test('Validate if the Question Title field has only whitespaces', function (assert) {
  assert.expect(3);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: null,
    standards: []
  });
  this.set('question',question);

  this.render(hbs`{{content/questions/gru-questions-edit isEditing=true question=question tempQuestion=question}}`);

  const $component = this.$('.gru-questions-edit');
  const $titleField = $component.find(".gru-input.title");

  assert.ok(!$titleField.find(".error-messages .error").length, 'Question Title error message not visible');

  $titleField.find("input").trigger('blur');

  return wait().then(function () {

    assert.ok($titleField.find(".error-messages .error").length, 'Question Title error should be visible');
    // Fill in the input field
    $titleField.find("input").val(' ');
    $titleField.find("input").trigger('blur');

    return wait().then(function () {
      assert.ok($titleField.find(".error-messages .error").length, 'Question Title error message should be visible');
    });
  });
});

test('Validate the character limit in the Question title field', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: null,
    standards: []
  });
  this.set('question',question);

  this.render(hbs`{{content/questions/gru-questions-edit isEditing=true question=question tempQuestion=question}}`);

  return wait().then(function () {
    const maxLenValue = this.$('.gru-questions-edit .gru-input.title input').prop('maxlength');
    assert.equal(maxLenValue, 50, "Input max length");
  });
});

test('Layout of the builder section', function (assert) {
  var question = Ember.Object.create(Ember.getOwner(this).ownerInjection(), {
    title: "Question Title",
    standards: []
  });

  this.set('question', question);
  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);

  return wait().then(function () {
    var $builderSection = this.$("#builder");
    assert.ok($builderSection.find('.header h2').length, "Builder title missing");
    assert.ok($builderSection.find('.panel-heading h3').length, "Missing Question label");
    assert.ok($builderSection.find('.panel-heading .instructions').length, "Missing Instructions");
    assert.ok($builderSection.find('.panel-body .text-empty').length, "Missing text empty message");
  });
});

test('Builder Edit', function (assert) {
  assert.expect(12);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    type:"MC",
    standards: []
  });
  this.set('question',question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit =  $component.find("#builder .actions .edit");
  var questionType = this.i18n.t('common.question-type.'+question.type).toString();
  $edit.click();
  return wait().then(function () {
    var $builderSection = $component.find("#builder");
    assert.ok($builderSection.find('.actions .save').length, "Save button missing");
    assert.ok($builderSection.find('.actions .cancel').length, "Cancel button missing");
    assert.ok($builderSection.find('.header h2').length, "Builder title missing");
    assert.equal($builderSection.find('.header h2').text(),"Editor - "+questionType, "Missing Question label");
    assert.ok($builderSection.find('.question-text .panel-heading h3').length, "Missing Question label");
    assert.ok($builderSection.find('.question-text .panel-heading .instructions').length, "Missing Question Instructions");
    assert.ok($builderSection.find('.question-text .panel-body .gru-rich-text-editor').length, "Missing gru-rich-text-editor component");
    assert.ok($builderSection.find('.question-text .panel-body .add-image').length, "Missing add image button");
    assert.ok($builderSection.find('.question-answer .panel-heading h3').length, "Missing Answer label");
    assert.ok($builderSection.find('.question-answer .panel-heading .instructions').length, "Missing Answer Instructions");
    assert.ok($builderSection.find('.question-answer .panel-footer .add-hint').length, "Missing add hints button");
    assert.ok($builderSection.find('.question-answer .panel-footer .add-explanation').length, "Missing add explanation button");
  });
});

test('Builder Edit for FIB', function (assert) {
  assert.expect(1);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    questionType:"FIB",
    standards: []
  });
  this.set('question',question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit =  $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    var $builderSection = $component.find("#builder");
    assert.ok(!$builderSection.find('.question-answer').length, "Answers section should not be visible for FIB");
  });
});

/*
 TODO: Disabled for GG-1133, fix it later
 test('Validate the character limit in text field', function (assert) {
 assert.expect(1);
 var question = Question.create(Ember.getOwner(this).ownerInjection(), {
 title: "",
 text:"",
 standards: []
 });
 this.set('question',question);

 this.render(hbs`{{content/questions/gru-questions-edit isBuilderEditing=true question=question tempQuestion=question}}`);

 const $component = this.$('.gru-questions-edit');
 const $rteField = $component.find(".editor-box");
 var newText ="";
 var i = 0;
 for (i = 0; i <=5000 ; i++) {
 newText+="a";
 }
 $rteField.html(newText);
 $rteField.trigger('blur');

 return wait().then(function () {
 assert.ok($rteField.find(".warning").length, 'Question text error message should be visible');
 });

 });
 */

/*
 TODO: Disabled for GG-1133, fix it later
 test('Update Question Builder', function (assert) {
 assert.expect(1);
 var newText ='Lorem ipsum dolor sit amet';
 var question = Question.create(Ember.getOwner(this).ownerInjection(), {
 title: 'Question for testing',
 text:"",
 type:'MC',
 standards: []
 });
 this.set('question',question);

 this.render(hbs`{{content/questions/gru-questions-edit isBuilderEditing=true question=question tempQuestion=question}}`);

 const $component = this.$('.gru-questions-edit');
 const $textField = $component.find(".gru-textarea.text");
 $textField.find("textarea").val(newText);
 $textField.find("textarea").change();

 const $save =  $component.find("#builder .actions .save");
 $save.click();
 return wait().then(function () {
 const $textFieldRead = $component.find("#builder .panel-body textarea");
 $textFieldRead.blur();
 assert.equal($textFieldRead.val(),newText, "The question text should be updated");
 });
 });
 */

/*
 TODO: Disabled for GG-1133, fix it later
 test('Validate update of default Title if the Question Text is updated', function (assert) {
 assert.expect(1);
 var newText ='Lorem ipsum dolor sit amet';
 var question = Question.create(Ember.getOwner(this).ownerInjection(), {
 title: 'New Question',
 text:"",
 type:'MC',
 standards: []
 });
 this.set('question',question);

 this.render(hbs`{{content/questions/gru-questions-edit isBuilderEditing=true question=question tempQuestion=question}}`);

 const $component = this.$('.gru-questions-edit');
 const $textField = $component.find(".gru-textarea.text");
 $textField.find("textarea").val(newText);
 $textField.find("textarea").change();

 const $save =  $component.find("#builder .actions .save");
 $save.click();
 return wait().then(function () {
 assert.equal($component.find(".title label b").text(),newText , "The question title should be updated");
 });
 });
 */

test('Update Question Save Answers', function (assert) {
  assert.expect(2);
  var newAnswerText ='Lorem ipsum dolor sit amet';
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text:"",
    type: QUESTION_TYPES.multipleChoice,
    answers:Ember.A([]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question }}`);
  const $component = this.$('.gru-questions-edit');
  const $edit =  $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $option = $component.find('.gru-multiple-choice .panel');
    assert.notOk($option.length, "Should not have answers");
    const $newAnswer = $component.find('div.add-answer a');
    $newAnswer.click();
    return wait().then(function () {
      const $textField = $component.find(".gru-multiple-choice .panel .gru-rich-text-editor");
      $textField.find(".rich-editor").html(newAnswerText);
      $textField.find(".rich-editor").change();
      const $save =  $component.find("#builder .actions .save");
      $save.click();
      return wait().then(function () {
        const $edit =  $component.find("#builder .actions .edit");
        $edit.click();
        return wait().then(function () {
          const $option = $component.find('.gru-multiple-choice');
          assert.ok($option.length, "New answer is empty");
        });
      });
    });
  });
});

test('Change answer text and cancel edit-Multiple Choice', function (assert) {
  var newAnswerText = 'Lorem ipsum dolor sit amet';
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.multipleChoice,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option A",
      'isCorrect': true
    }), Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option B",
      'isCorrect': false
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $textField = $component.find(".gru-multiple-choice .panel:nth-child(1) .gru-rich-text-editor");
    $textField.find(".rich-editor").html(newAnswerText);
    $textField.find(".rich-editor").change();
    const $cancel = $component.find("#builder .actions .cancel");
    $cancel.click();
    return wait().then(function () {
      const $edit = $component.find("#builder .actions .edit");
      $edit.click();
      return wait().then(function () {
        const $textField = $component.find(".gru-multiple-choice .panel:nth-child(1) .gru-rich-text-editor");
        assert.equal($textField.find(".rich-editor").html(), question.get('answers')[0].text, "Incorrect answer text");
      });
    });
  });
});

test('Update answer text - True/False', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.trueFalse,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "True",
      'isCorrect': true,
      'type':"text"
    }), Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "False",
      'isCorrect': false,
      'type':"text"
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $trueOption = $component.find(".gru-true-false .panel:nth-child(2)");
    const $check=$trueOption.find('.check');
    $check.click();
    return wait().then(function () {
      const $save = $component.find("#builder .actions .save");
      $save.click();
      return wait().then(function () {
        const $edit = $component.find("#builder .actions .edit");
        $edit.click();
        return wait().then(function () {
          assert.equal($component.find('.check.correct').length,1, "Incorrect number of correct answer");
          assert.ok($component.find('.panel:nth-child(2) .check.correct').length, "False should be checked");
        });
      });
    });
  });
});

test('Change answer text and cancel- True/False', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.trueFalse,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "True",
      'isCorrect': true,
      'type':"text"
    }), Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "False",
      'isCorrect': false,
      'type':"text"
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $trueOption = $component.find(".gru-true-false .panel:nth-child(2)");
    const $check=$trueOption.find('.check');
    $check.click();
    return wait().then(function () {
      const $cancel = $component.find("#builder .actions .cancel");
      $cancel.click();
      return wait().then(function () {
        const $edit = $component.find("#builder .actions .edit");
        $edit.click();
        return wait().then(function () {
          assert.equal($component.find('.check.correct').length,1, "Incorrect number of correct answer");
          assert.ok($component.find('.panel:nth-child(1) .check.correct').length, "True should be checked");
        });
      });
    });
  });
});

test('Update answer text - (drag/drop) Reorder', function (assert) {
  const newText = 'Option Text Updated';

  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "Question description",
    type: QUESTION_TYPES.hotTextReorder,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text",
      'isCorrect': true,
      'type':"text"
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  assert.ok($component.find('.answer-content').hasClass('view-mode'));

  var $options = $component.find('.answer-content .answer-text');
  assert.equal($options.length, 1, 'Starting options');
  assert.equal($options.eq(0).text().trim(), question.get('answers')[0].get('text'), 'Option text');

  const $edit = $component.find("#builder .header .actions .edit");
  $edit.click();
  return wait().then(function () {

    var $optionInput = $component.find(".gru-reorder .panel:first-of-type .gru-rich-text-editor .rich-editor");
    $optionInput.html(newText);
    $optionInput.trigger('blur');

    $component.find('.gru-reorder .add-answer a').click();
    return wait().then(function () {

      $optionInput = $component.find(".gru-reorder .panel:eq(1) .gru-rich-text-editor .rich-editor");
      $optionInput.html(newText);
      $optionInput.trigger('blur');

      const $save = $component.find("#builder .header .actions .save");
      $save.click();
      return wait().then(function () {

        $options = $component.find('.answer-content');
        assert.equal($options.length, 2, 'Options after edit');
        assert.equal($options.eq(0).find('.gru-rich-text-editor .rich-editor').html(), newText, 'Option text after edit');
      });
    });
  });
});

test('Remove answer and cancel - (drag/drop) Reorder', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.hotTextReorder,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text A",
      'isCorrect': true,
      'type':"text"
    }), Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text B",
      'isCorrect': null,
      'type':"text"
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  var $options = $component.find('.answer-content');
  assert.equal($options.length, 2, 'Starting options');

  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {

    // Remove the first item
    $component.find(".gru-reorder .panel:first-of-type .delete").click();
    return wait().then(function () {

      $options = $component.find('.gru-reorder .panel');
      assert.ok($options.length, 1, 'Number of options after delete');
      assert.equal($options.eq(0).find('.gru-rich-text-editor .rich-editor').html(), question.get('answers')[1].get('text'), 'Text of remaining option');

      const $cancel = $component.find("#builder .actions .cancel");
      $cancel.click();
      return wait().then(function () {

        var $options = $component.find('.answer-content');
        assert.equal($options.length, 2, 'Starting options');
      });
    });
  });
});

test('Update answer text - Open Ended', function (assert) {
  const newText = 'Answer text updated';

  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "Question description",
    type: QUESTION_TYPES.openEnded,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer text",
      'isCorrect': true,
      'type':"text",
      standards: []
    })])
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  var $options = $component.find('.gru-open-ended .answer-text');
  assert.equal($options.length, 1, 'Number of answer options');
  assert.ok($options.find('> textarea'), 'View textarea');
  assert.equal($options.eq(0).find('textarea').val(), question.get('answers')[0].get('text'), 'Answer text');

  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {

    var $optionInput = $component.find(".gru-open-ended .text-area-container .gru-textarea textarea");
    $optionInput.val(newText);
    $optionInput.trigger('blur');

    const $save = $component.find("#builder .actions .save");
    $save.click();
    return wait().then(function () {

      $options = $component.find('.gru-open-ended .answer-text');
      assert.equal($options.eq(0).find('textarea').val(), newText, 'Answer text after edit');
    });
  });
});

test('Update answer and cancel - Open Ended', function (assert) {
  const newText = 'Answer text';

  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.openEnded,
    answers: Ember.A([]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  var $options = $component.find('.gru-open-ended .answer-text');
  assert.equal($options.length, 1, 'Number of answer options');

  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {

    var $optionInput = $component.find(".gru-open-ended .text-area-container .gru-textarea textarea");
    assert.equal($optionInput.val(), '', 'Empty text for default option');
    $optionInput.val(newText);
    $optionInput.trigger('blur');

    const $cancel = $component.find("#builder .actions .cancel");
    $cancel.click();
    return wait().then(function () {

      $options = $component.find('.gru-open-ended .answer-text');
      assert.equal($options.eq(0).find('textarea').val(), '', 'Answer text after cancel');
    });
  });
});

test('Select one correct answer at least', function(assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.multipleChoice,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text A",
      'isCorrect': false,
      'type':"text"
    }), Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text B",
      'isCorrect': false,
      'type':"text"
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $save = $component.find("#builder .actions .save");
    $save.click();
    return wait().then(function () {
      assert.ok($component.find('.missing-correct-answer').length, 'Missing validation for missing correct answer');
    });
  });
});

test('Update HS-Image', function (assert) {
  assert.expect(2);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text:"",
    type: QUESTION_TYPES.hotSpotImage,
    standards: []
  });
  var tempQuestion = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text:"",
    type: QUESTION_TYPES.hotSpotImage,
    answers:Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer text",
      'isCorrect': true,
      'type':"text"
    })
    ]),
    subject: 'CCSS.K12.Math',
    category: 'k_12'
  });
  this.set('question', question);
  this.set('tempQuestion', tempQuestion);

  this.render(hbs`{{content/questions/gru-questions-edit isBuilderEditing=true question=question tempQuestion=tempQuestion}}`);
  const $component = this.$('.gru-questions-edit');
  const $save =  $component.find("#builder .actions .save");
  $save.click();
  return wait().then(function () {
    const $option = $component.find('.gru-hs-image .hs-container');
    assert.ok($option.length, "The answer should be saved");
    assert.ok($option.find('.panel-footer .correct .check'), "New answer should be correct");
  });
});
test('Change HS-Image and Cancel', function (assert) {
  assert.expect(3);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text:"",
    type: QUESTION_TYPES.hotSpotImage,
    answers:Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer text",
      'isCorrect': true,
      'type':"text"
    }),Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer text",
      'isCorrect': true,
      'type':"text"
    })
    ]),
    standards: []
  });

  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  assert.equal($component.find('.hs-container').length, 2, "Should have 2 answers");
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $firstAnswer = $component.find('.hs-container:nth-child(1)');
    const $deleteAnswer = $firstAnswer.find('.panel-footer .btn-group .delete');
    $deleteAnswer.click();
    return wait().then(function () {
      assert.equal($component.find('.hs-container').length, 1, "Should have 1 answers");
      const $cancel =  $component.find("#builder .actions .cancel");
      $cancel.click();
      return wait().then(function () {
        assert.equal($component.find('.hs-container').length, 2, "Should have 2 answers");
      });
    });
  });
});

test('Delete answer HS-Image ', function (assert) {
  assert.expect(3);
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "Question description",
    type: QUESTION_TYPES.hotSpotImage,
    answers:Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer text",
      'isCorrect': true,
      'type':"text"
    }),Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer text",
      'isCorrect': true,
      'type':"text"
    })
    ]),
    standards: []
  });

  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  assert.equal($component.find('.hs-container').length, 2, "Should have 2 answers");
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $firstAnswer = $component.find('.hs-container:nth-child(1)');
    const $deleteAnswer = $firstAnswer.find('.panel-footer .btn-group .delete');
    $deleteAnswer.click();
    return wait().then(function () {
      assert.equal($component.find('.hs-container').length, 1, "Should have 1 answers");
      const $save =  $component.find("#builder .actions .save");
      $save.click();
      return wait().then(function () {
        assert.equal($component.find('.hs-container').length, 1, "Should have 1 answers");
      });
    });
  });
});

test('HS-Image validate has images', function (assert) {
  assert.expect(1);

  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text:"",
    type: QUESTION_TYPES.hotSpotImage,
    answers:Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': null,
      'isCorrect': true,
      'type':"text"
    }),Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': null,
      'isCorrect': true,
      'type':"text"
    })
    ]),
    standards: []
  });

  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  const $edit = $component.find("#builder .actions .edit");
  $edit.click();

  return wait().then(function () {

    const $save =  $component.find("#builder .actions .save");
    $save.click();

    return wait().then(function () {
      assert.ok($component.find('.missing-images').length, 'Missing validation for missing images');
    });
  });
});

test('Update answer text - Hot Text Highlight', function (assert) {
  const newText = 'Answer text [updated]';

  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "Question description",
    type: QUESTION_TYPES.hotTextHighlight,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Answer [text]",
      'isCorrect': true,
      'type': 'text',
      'highlightType': 'word'
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  var $answer = $component.find('.gru-hot-text-highlight');
  assert.ok($answer, 'Answer component');
  assert.equal($answer.find('.answer-text textarea').val(), question.get('answers.firstObject').get('text'), 'Answer text');

  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    $answer = $component.find('.gru-hot-text-highlight');
    var $optionInput = $answer.find(".gru-textarea textarea");
    $optionInput.val(newText);
    $optionInput.trigger('blur');

    const $save = $component.find("#builder .actions .save");
    $save.click();
    return wait().then(function () {
      $answer = $component.find('.gru-hot-text-highlight');
      assert.equal($answer.find('.answer-text textarea').val(), newText, 'Answer text after edit');
    });
  });
});

test('Update answer and cancel - Hot Text Highlight', function (assert) {
  const newText = 'Answer text';

  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "Question description",
    type: QUESTION_TYPES.hotTextHighlight,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "",
      'isCorrect': true,
      'type': 'text',
      'highlightType': 'word'
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    var $answer = $component.find('.gru-hot-text-highlight');
    var $optionInput = $answer.find(".gru-textarea textarea");
    assert.ok($answer, 'Answer component');
    assert.equal($optionInput.val(), '', 'Empty text for default option');
    $optionInput.val(newText);
    $optionInput.trigger('blur');

    const $cancel = $component.find("#builder .actions .cancel");
    $cancel.click();
    return wait().then(function () {
      $answer = $component.find('.gru-hot-text-highlight');
      assert.equal($answer.find('.answer-text textarea').val(), '', 'Answer text after cancel');
    });
  });
});

test('Layout edit question image', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.hotTextHighlight,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "",
      'isCorrect': true,
      'type': 'text',
      'highlightType': 'word'
    })]),
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit = $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    var $addImage = $component.find(".add-image button");
    assert.ok($addImage, 'Add image button');
    $addImage.click();
    return wait().then(function () {
      var $image = $component.find('.gru-image');
      assert.ok($image, 'Image picker');
    });
  });
});

test('Layout view question image', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.hotTextHighlight,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "",
      'isCorrect': true,
      'type': 'text',
      'highlightType': 'word'
    })]),
    thumbnail: 'image-id',
    standards: []
  });
  this.set('question', question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');

  return wait().then(function () {
    var $addImage = $component.find(".add-image button");
    assert.notOk($addImage.length, 'Add image button');
    var $image = $component.find('.gru-image');
    assert.ok($image, 'Image shoudl be shown');
  });
});

test('Builder Edit with advanced edit button for the Multiple Choice answers', function (assert) {
  var question = Question.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question for testing',
    text: "",
    type: QUESTION_TYPES.multipleChoice,
    answers: Ember.A([Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text A",
      'isCorrect': false,
      'type':"text"
    }), Answer.create(Ember.getOwner(this).ownerInjection(), {
      'text': "Option Text B",
      'isCorrect': false,
      'type':"text"
    })]),
    standards: []
  });
  this.set('question',question);

  this.render(hbs`{{content/questions/gru-questions-edit question=question}}`);
  const $component = this.$('.gru-questions-edit');
  const $edit =  $component.find("#builder .actions .edit");
  $edit.click();
  return wait().then(function () {
    const $switchComponent = $component.find(".question-answer .panel-heading .advanced-button .gru-switch");
    assert.ok($switchComponent.length, "Missing advanced button switchComponent");
    const $richEditorComponent = $component.find(".question-answer .panel-body .gru-rich-text-editor");

    assert.ok($richEditorComponent.length, "Missing gru-rich-text-editor component");
    assert.ok($richEditorComponent.find('.btn-toolbar').hasClass("hidden"), "btn-toolbar should be hidden for the answers editors");

    $switchComponent.find("a").click();

    return wait().then(function () {
      assert.ok(!$richEditorComponent.find('.btn-toolbar').hasClass("hidden"), "btn-toolbar should not be hidden for the answers editors");
    });
  });
});

