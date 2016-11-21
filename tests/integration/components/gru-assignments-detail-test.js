import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gru-assignments-detail', 'Integration | Component | gru assignments detail', {
  integration: true
});

test('Layout Student View', function(assert) {
  var assignment = {
    hasStarted:false,
    title:'Assessment 3 Not Started',
    standards:'',
    assignedDate:'27/10/2016',
    dueDate:'4/11/2016',
    totalAttempts:15,
    attempts:2,
    score:70,
    questions:['question1','question2','question3'],
    learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    settings:{
      navigation:'Forward only',
      showScore:'Per question',
      answerKey:false
    }};
  this.set('assignment',assignment);
  this.render(hbs`{{gru-assignments-detail assignment=assignment}}`);

  var $assignmentDetailComponent = this.$();
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions').length, 'Missing panel-heading actions');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .text-container .attempts-left').length, 'Missing attempts left label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .text-container .last-attempt .score').length, 'Missing last attempt score');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .title').length, 'Missing title label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .text-container .questions').length, 'Missing questions label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .text-container .date-assigned').length, 'Missing date assigned label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .learning-objective').length, 'Missing Learning Objective label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .standards').length, 'Missing Standards label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .navigation').length, 'Missing Navigation label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .attempts').length, 'Missing Attempts label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .show-score').length, 'Missing Show Score label');
  assert.equal($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body span.score').attr('style'),'background-color: #F8BA41','Incorrect score background color');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .answer-key').length, 'Missing Answer Key label');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .teacher-question').length, 'Question Teacher label should not appear');
});

test('Actions when the assessment has not started on Student View', function(assert) {
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

  var $assignmentDetailComponent = this.$();
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'Missing play button');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .launch').length, 'Launch button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .add-student').length, 'Add student button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .delete').length, 'Delete button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .preview').length, 'Preview button should not appear');
});

test('Actions when the assessment has started and have attempts left on Student View', function(assert) {
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

  var $assignmentDetailComponent = this.$();
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .launch').length, 'Launch button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .add-student').length, 'Add student button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .delete').length, 'Delete button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .preview').length, 'Preview button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'Play button should not appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should not appear');
});

test('Actions when the assessment has started and have not attempts on Student View ', function(assert) {
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

  var $assignmentDetailComponent = this.$();
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .launch').length, 'Launch button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .add-student').length, 'Add student button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .delete').length, 'Delete button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .preview').length, 'Preview button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'Play button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should not appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should appear');
});

test('Layout Teacher View', function(assert) {
  var assignment = {
    hasStarted:false,
    score:0,
    title:'Assessment 3 Not Started',
    standards:'',
    createdDate:1475859664000,
    modifiedDate:1475859664000,
    dueDate:1478617433000,
    totalStudents:20,
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
    }
  };

  this.set('assignment',assignment);
  this.render(hbs`{{gru-assignments-detail assignment=assignment isTeacher=true}}`);

  var $assignmentDetailComponent = this.$();
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions').length, 'Missing panel-heading actions');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .text-container .attempts-left').length, 'Attempts left label should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .attempts-container .last-attempt .score').length, 'Last attempt score should not appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .title').length, 'Missing title label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .teacher-question').length, 'Missing Question label');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .text-container .date-assigned').length, 'Date assigned label should not appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .learning-objective').length, 'Missing Learning Objective label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .standards').length, 'Missing Standards label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .navigation').length, 'Missing Navigation label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .attempts').length, 'Missing Attempts label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .show-score').length, 'Missing Show Score label');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-body .answer-key').length, 'Missing Answer Key label');
});

test('Actions Teacher View', function(assert) {
  this.render(hbs`{{gru-assignments-detail isTeacher=true}}`);

  var $assignmentDetailComponent = this.$();
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .play').length, 'play button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .redo').length, 'Redo button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .view-report').length, 'View report button should not appear');
  assert.notOk($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .no-attempts').length, 'No attempts label should not appear');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .launch').length, 'Missing launch button');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .add-student').length, 'Missing add student button');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .delete').length, 'Missing delete button');
  assert.ok($assignmentDetailComponent.find('.gru-assignments-detail .assignment-detail .panel-heading .actions .preview').length, 'Missing preview button');
});
