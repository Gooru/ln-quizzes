import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'quizzes/tests/helpers/ember-simple-auth';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';

const configurationStub = Ember.Service.extend({
  configuration:{
    properties: {
      students: [
        {id:'student-1',
          firstName:'student-1',
          lastName:'student-1',
          username:'student-1',
          email:'emailstudent-1@gmail.com'
        },
        {id:'student-2',
          firstName:'student-2',
          lastName:'student-2',
          username:'student-2',
          email:'emailstudent-2@gmail.com'
        }
      ],
      context: {
        classId:'class-id'
      }
    }
  }
});
moduleForAcceptance('Acceptance | assignments',{
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: true,
      token: 'token-value',
      user: {
        providedAt: Date.now()
      }
    });
    //this.application.unregister('service:configuration');
    //this.application.register('service:configuration', configurationStub);
  },
  //afterEach: function() {
  //  Ember.run(this.application, 'destroy');
  //}
});

test('visiting assignments', function(assert) {
  visit('/profile/profile-id?isTeacher=true');

  andThen(function() {
    assert.equal(currentURL(), '/profile/profile-id?isTeacher=true');
    const $addStudent = find('button.add-student');
    click($addStudent);
    andThen(function () {
      T.exists(assert, find('.gru-assign-student-modal'), 'Missing assign student modal');
    });
  });
});
