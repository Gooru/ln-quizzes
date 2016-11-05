import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('player/questions/gru-single-choice', 'Unit | Component | player/questions/gru single choice', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('selectAnswerChoice on load', function(assert) {
  let component = this.subject();
  let expectedAnswerId = 'answer';
  component.set('notifyAnswerChanged', function(answerId) {
    assert.equal(answerId, expectedAnswerId, 'Answer should match in answer changed');
  });
  component.set('notifyAnswerLoaded', function(answerId) {
    assert.equal(answerId, expectedAnswerId, 'Answer should match in answer loaded');
  });
  component.set('notifyAnswerLoaded', function() {
    assert.ok(false, 'Answer completed should not be called');
  });
  component.send('selectAnswerChoice', 'answer');
});
