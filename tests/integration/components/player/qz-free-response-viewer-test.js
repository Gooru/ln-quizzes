import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import RubricModel from 'quizzes-addon/models/rubric/rubric';
import RubricCategoryModel from 'quizzes-addon/models/rubric/rubric-category';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleForComponent(
  'player/qz-free-response-viewer',
  'Integration | Component | player/qz free response viewer',
  {
    integration: true
  }
);

test('Layout with rubric OFF', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: RubricModel.create({
      id: '1234'
    })
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-free-response-viewer question=question}}`);

  var $component = this.$();
  const $freeResponseViewer = $component.find('.qz-free-response-viewer');
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric').length,
    'Missing response section'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt').length,
    'Missing prompt'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt .icon').length,
    'Missing prompt question icon'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt .question-text')
      .length,
    'Missing question text'
  );
  assert.ok(
    $freeResponseViewer.find(
      '.rubric-response.rubric .question-response .qz-rich-text-editor'
    ).length,
    'Missing rich text editor'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .actions .save').length,
    'Missing save button'
  );
  assert.notOk(
    $freeResponseViewer.find('.rubric-response.no-rubric').length,
    'No-Rubric should not appear'
  );
  assert.notOk(
    $freeResponseViewer.find('.rubric-information').length,
    'Rubric information menu should not appear'
  );
});

test('Layout with rubric ON without categories', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: RubricModel.create({
      id: '1234',
      title: 'TitleRubric'
    })
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-free-response-viewer question=question}}`);

  var $component = this.$();
  const $freeResponseViewer = $component.find('.qz-free-response-viewer');
  assert.notOk(
    $freeResponseViewer.find('.rubric-response.no-rubric').length,
    'Should have rubric'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric').length,
    'Rubric Response should appear'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt').length,
    'Missing prompt'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt .icon').length,
    'Missing prompt question icon'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt .question-text')
      .length,
    'Missing question text'
  );
  assert.ok(
    $freeResponseViewer.find(
      '.rubric-response.rubric .question-response .qz-rich-text-editor'
    ).length,
    'Missing rich text editor'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .actions .save').length,
    'Missing save button'
  );
  assert.ok(
    !$freeResponseViewer.find('.rubric-information').length,
    'Rubric information menu should not appear'
  );
});

test('Layout with rubric ON with categories', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: RubricModel.create({
      id: '1234',
      title: 'TitleRubric',
      categories: Ember.A([
        RubricCategoryModel.create({
          id: 'category-1',
          title: 'title',
          score: 2
        }),
        RubricCategoryModel.create({
          id: 'category-2',
          title: 'title',
          score: 3
        })
      ])
    })
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-free-response-viewer question=question}}`);

  var $component = this.$();
  const $freeResponseViewer = $component.find('.qz-free-response-viewer');
  assert.notOk(
    $freeResponseViewer.find('.rubric-response.no-rubric').length,
    'Should have rubric'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric').length,
    'Rubric Response should appear'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt').length,
    'Missing prompt'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt .icon').length,
    'Missing prompt question icon'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .prompt .question-text')
      .length,
    'Missing question text'
  );
  assert.ok(
    $freeResponseViewer.find(
      '.rubric-response.rubric .question-response .qz-rich-text-editor'
    ).length,
    'Missing rich text editor'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.rubric .actions .save').length,
    'Missing save button'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-information').length,
    'Rubric information menu should appear'
  );
});

test('Full rubric', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: RubricModel.create({
      id: '1234',
      title: 'TitleRubric',
      categories: Ember.A([
        RubricCategoryModel.create({
          id: 'category-1',
          title: 'title',
          score: 2
        }),
        RubricCategoryModel.create({
          id: 'category-2',
          title: 'title',
          score: 3
        })
      ])
    })
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-free-response-viewer question=question}}`);

  var $component = this.$();
  const $freeResponseViewer = $component.find('.qz-free-response-viewer');
  const $information = $freeResponseViewer.find('.rubric-information');

  assert.notOk(
    $freeResponseViewer.find('.rubric-information.full-rubric').length,
    'Rubric information should not be on full screen'
  );

  assert.ok(
    $information.find('.header .keyboard_arrow_left').length,
    'Rubric information should not be on full screen'
  );
  assert.equal(
    $information.find('.header span').text(),
    'Full Rubric',
    'Rubric information should be on full screen'
  );
  const $header = $information.find('.header');
  $header.click();
  return wait().then(function() {
    assert.ok(
      $information.find('.header .keyboard_arrow_right').length,
      'Rubric information should be on full screen'
    );
    assert.equal(
      $information.find('.header span').text(),
      'Rubric',
      'Rubric information should be on full screen'
    );
    assert.ok(
      $freeResponseViewer.find('.rubric-information.full-rubric').length,
      'Rubric information should be on full screen'
    );
  });
});

test('Rubric Information', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: RubricModel.create({
      id: '1234',
      title: 'TitleRubric',
      categories: Ember.A([
        RubricCategoryModel.create({
          id: 'category-1',
          title: 'title',
          score: 2
        }),
        RubricCategoryModel.create({
          id: 'category-2',
          title: 'title',
          score: 3
        })
      ])
    })
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-free-response-viewer question=question}}`);

  var $component = this.$();
  const $freeResponseViewer = $component.find('.qz-free-response-viewer');
  const $information = $freeResponseViewer.find('.rubric-information');
  assert.ok(
    $information.find('.categories .total').length,
    'Missing categories total'
  );
  assert.equal(
    $information.find('.categories .category').length,
    2,
    'Missing categories total'
  );
  assert.ok(
    $information.find('.rubric-preview').length,
    'Missing rubric preview'
  );
});