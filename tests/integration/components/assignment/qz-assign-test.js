import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('assignment/qz-assign', 'Integration | Component | assignment/qz assign', {
  integration: true
});

test('Assign Layout', function(assert) {
  var teacher = {
    id:'988712',
      firstName:'Amara',
      lastName:'Humphry',
      username:'amara',
      email:'emailTeacher@gmail.com'
  };
  var students = [{
    id:'student-1',
    firstName:'Anaí',
    lastName:'Arroyo',
    username:'anaiarroyo',
    email:'emailstudent-1@gmail.com'
  },{
    id:'student-2',
    firstName:'Melany',
    lastName:'Delgado',
    username:'melanydelgado',
    email:'emailstudent-2@gmail.com'
  }];
  this.set('teacherConfig',teacher);
  this.set('studentList',students);
  this.render(hbs`{{assignment/qz-assign studentList=studentList teacherConfig=teacherConfig}}`);
  var $component = this.$();
  assert.ok($component.find('.qz-assign-students').length,'Assign students missing');
});
