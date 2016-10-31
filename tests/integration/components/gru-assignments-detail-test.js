import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assignments-detail', 'Integration | Component | gru assignments detail', {
  integration: true
});

test('Layout', function(assert) {
  var assignment = {
    hasStarted:false,
    score:null,
    title:'Assessment 3 Not Started',
    standards:'',
    assignedDate:'27/10/2016',
    dueDate:'4/11/2016',
    totalAttempts:15,
    attempts:2,
    lastAttempt:{
      score:60
    },
    questions:['question1','question2','question3'],
    learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    settings:{
      navigation:'Forward only',
      showScore:'Per question',
      answerKey:false
    }};
  this.set('assignment',assignment);
  this.render(hbs`{{gru-assignments-detail assignment=assignment}}`);

  var $assessmentDetailComponent = this.$();
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions').length, 'Missing panel-heading actions');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .attempts-container .attempts-left').length, 'Missing attempts left label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .attempts-container .last-attempt .score').length, 'Missing last attempt score');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .title').length, 'Missing title label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .questions-container .questions').length, 'Missing questions label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .questions-container .date-assigned').length, 'Missing date assigned label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .learning-objective').length, 'Missing Learning Objective label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .standards').length, 'Missing Standards label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .navigation').length, 'Missing Navigation label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .attempts').length, 'Missing Attempts label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .show-score').length, 'Missing Show Score label');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .answer-key').length, 'Missing Answer Key label');
});
test('Actions when the assessment has not started', function(assert) {
  var assignment = {
    hasStarted:false,
    score:null,
    title:'Assessment 3 Not Started',
    standards:'',
    assignedDate:'27/10/2016',
    dueDate:'4/11/2016',
    totalAttempts:15,
    attempts:2,
    lastAttempt:{
      score:60
    },
    questions:['question1','question2','question3'],
    learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    settings:{
      navigation:'Forward only',
      showScore:'Per question',
      answerKey:false
    }};
  this.set('assignment',assignment);
  this.render(hbs`{{gru-assignments-detail assignment=assignment}}`);

  var $assessmentDetailComponent = this.$();
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'Missing play button');
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should not appear');
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should not appear');
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should not appear');
});
test('Actions when the assessment has started and have attempts left', function(assert) {
  var assignment = {
    hasStarted:true,
    score:null,
    title:'Assessment Started',
    standards:'',
    assignedDate:'27/10/2016',
    dueDate:'4/11/2016',
    totalAttempts:15,
    attempts:2,
    lastAttempt:{
      score:60
    },
    questions:['question1','question2','question3'],
    learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    settings:{
      navigation:'Forward only',
      showScore:'Per question',
      answerKey:false
    }};
  this.set('assignment',assignment);
  this.render(hbs`{{gru-assignments-detail assignment=assignment}}`);

  var $assessmentDetailComponent = this.$();
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'Play button should not appear');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should appear');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should appear');
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should not appear');
});
test('Actions when the assessment has started and have not attempts ', function(assert) {
  var assignment = {
    hasStarted:true,
    score:null,
    title:'Assessment Started',
    standards:'',
    assignedDate:'27/10/2016',
    dueDate:'4/11/2016',
    totalAttempts:15,
    attempts:15,
    lastAttempt:{
      score:60
    },
    questions:['question1','question2','question3'],
    learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    settings:{
      navigation:'Forward only',
      showScore:'Per question',
      answerKey:false
    }};
  this.set('assignment',assignment);
  this.render(hbs`{{gru-assignments-detail assignment=assignment}}`);

  var $assessmentDetailComponent = this.$();
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'Play button should not appear');
  assert.notOk($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should not appear');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should appear');
  assert.ok($assessmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should appear');
});
