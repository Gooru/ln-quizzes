import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:resource/resource', 'Unit | Serializer | resource/resource');

test('normalizeReadResource', function(assert) {
  const serializer = this.subject();
  const resourceData = {
    id: 'resource-id',
    isResource:	false,
    questionData: {
      title: 'question-title',
      type: 'singleChoice',
      correctAnswer: [{
        value: 'a'
      }],
      body: 'question-body',
      interaction: {
        shuffle: false,
        maxChoices: 1,
        prompt:	'question-prompt',
        choices: [
          {
            text: 'answer0-text',
            isFixed: false,
            value: 'answer0-value'
          },
          {
            text: 'answer1-text',
            isFixed: false,
            value: 'answer1-value'
          }
        ]
      }
    }
  };
  const resource = serializer.normalizeReadResource(resourceData);
  assert.equal(resource.get('id'), 'resource-id', 'Wrong id');
  assert.equal(resource.get('title'), 'question-title', 'Wrong title');
  assert.equal(resource.get('type'), 'singleChoice', 'Wrong type');
  assert.notOk(resource.get('isResource'), 'Wrong value for isResource');
  assert.deepEqual(resource.get('correctAnswer'), [{value: 'a'}], 'Wrong correctAnswer');
  assert.equal(resource.get('body'), 'question-body', 'Wrong body');
  assert.notOk(resource.get('shuffle'), 'Wrong value for shuffle');
  assert.equal(resource.get('maxChoices'), 1, 'Wrong maxChoices');
  assert.equal(resource.get('prompt'), 'question-prompt', 'Wrong maxChoices');
  assert.equal(resource.get('answers').length, 2, 'Wrong answers length');
  resource.get('answers').forEach(function(answer, index) {
    assert.equal(answer.get('text'), `answer${index}-text`, `Wrong answer ${index} text`);
    assert.equal(answer.get('value'), `answer${index}-value`, `Wrong answer ${index} value`);
    assert.notOk(answer.get('isFixed'), 'Wrong answer ${index} isFixed');
  });
});
