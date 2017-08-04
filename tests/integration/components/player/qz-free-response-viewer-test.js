import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/qz-free-response-viewer',
  'Integration | Component | player/qz free response viewer',
  {
    integration: true
  }
);

test('Layout without rubric', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-free-response-viewer question=question}}`);

  var $component = this.$();
  const $freeResponseViewer = $component.find('.qz-free-response-viewer');
  assert.ok(
    $freeResponseViewer.find('.rubric-response.no-rubric').length,
    'Missing response section'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.no-rubric .prompt').length,
    'Missing prompt'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.no-rubric .prompt .icon').length,
    'Missing prompt question icon'
  );
  assert.ok(
    $freeResponseViewer.find(
      '.rubric-response.no-rubric .prompt .question-text'
    ).length,
    'Missing question text'
  );
  assert.ok(
    $freeResponseViewer.find(
      '.rubric-response.no-rubric .question-response .qz-rich-text-editor'
    ).length,
    'Missing rich text editor'
  );
  assert.ok(
    $freeResponseViewer.find('.rubric-response.no-rubric .actions .save')
      .length,
    'Missing save button'
  );
  assert.notOk(
    $freeResponseViewer.find('.rubric-response.rubric').length,
    'Rubric should not appear'
  );
  assert.notOk(
    $freeResponseViewer.find('.rubric-information').length,
    'Rubric information menu should not appear'
  );
});

test('Layout with rubric', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: 'rubric'
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
