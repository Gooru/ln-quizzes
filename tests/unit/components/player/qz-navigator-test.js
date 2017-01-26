import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes/models/resource/resource';

moduleForComponent('player/qz-navigator', 'Unit | Component | player/qz navigator', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('closeNavigator', function(assert) {
  let component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onCloseNavigator', 'Action sent should match');
  });
  component.send('closeNavigator');
});

test('finishCollection', function(assert) {
  let component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onFinishCollection', 'Action sent should match');
  });
  component.send('finishCollection');
});

test('seeUsageReport', function(assert) {
  let component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onFinishCollection', 'Action sent should match');
  });
  component.send('seeUsageReport');
});

test('selectItem navigation disabled', function(assert) {
  assert.expect(0);
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let item = {
    resource: question
  };
  component.set('isNavigationDisabled', true);
  component.set('sendAction', function() {
    assert.ok(false, 'Send action should not be called');
  });
  component.send('selectItem', item);
});

test('selectItem no resource', function(assert) {
  assert.expect(0);
  let component = this.subject();
  let item = {};
  component.set('sendAction', function() {
    assert.ok(false, 'Send action should not be called');
  });
  component.send('selectItem', item);
});

test('selectItem with item selected', function(assert) {
  assert.expect(2);
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let item = {
    resource: question
  };
  component.set('onItemSelected', {});
  component.set('sendAction', function(actionName, resource) {
    if(actionName === 'onCloseNavigator') {
      assert.ok(true, 'Close navigator action sent');
    }
    if(actionName === 'onItemSelected') {
      assert.deepEqual(resource, question, 'Resource param should match');
    }
  });
  component.send('selectItem', item);
});

test('selectItem with no item selected', function(assert) {
  assert.expect(1);
  let component = this.subject();
  let question = Question.create(Ember.getOwner(this).ownerInjection());
  let item = {
    resource: question
  };
  component.set('onItemSelected', null);
  component.set('sendAction', function(actionName) {
    if(actionName === 'onCloseNavigator') {
      assert.ok(true, 'Close navigator action sent');
    }
    if(actionName === 'onItemSelected') {
      assert.ok(false, 'On item selected action should not be sent');
    }
  });
  component.send('selectItem', item);
});
