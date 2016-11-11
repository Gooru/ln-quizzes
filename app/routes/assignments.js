import Ember from 'ember';
import Profile from 'quizzes/models/profile/profile';

export default Ember.Route.extend({

  queryParams: {
    isTeacher : {}
  },
  // -------------------------------------------------------------------------
  // Dependencies

  configurationService: Ember.inject.service('configuration'),

  contextService: Ember.inject.service("api-sdk/context"),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get model for the controller
   */
  model: function(params) {
    let profileId = params.profileId;
    //TODO: Assignments should be get from quizzes API
    let assignments = Ember.A([
      Ember.Object.create({
        hasStarted:true,
        score:60,
        title:'Assessment 1',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1477021500,
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
          answerKey:true
        }
      }),
        Ember.Object.create({
            hasStarted:true,
            score:70,
            title:'Assessment 2',
            standards:'',
            assignedDate:1474072003426,
            dueDate:1474072003426,
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
          }),
      Ember.Object.create({
        hasStarted:false,
        score:0,
        title:'Assessment 3 Not Started',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:70,
        title:'Assessment 4',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:70,
        title:'Assessment 5 No more attempts',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
        }
      }),
      Ember.Object.create({
        hasStarted:true,
        score:70,
        title:'Assessment 6',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
        totalAttempts:15,
        attempts:12,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:100,
        title:'Assessment 7',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:70,
        title:'Assessment 8',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:70,
        title:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the in',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
        totalAttempts:15,
        attempts:5,
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
      }),Ember.Object.create({
        hasStarted:true,
        score:70,
        title:'Assessment 10 first assigned',
        standards:'',
        assignedDate:1477021500,
        dueDate:1474072003426,
        totalAttempts:15,
        attempts:7,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:40,
        title:'Assessment AAAAA',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:40,
        title:'Collection',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      }),
      Ember.Object.create({
        hasStarted:true,
        score:40,
        title:'Collection for practice',
        standards:'',
        assignedDate:1474072003426,
        dueDate:1474072003426,
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
      })]);

    let assignmentsTeacher = Ember.A([
      Ember.Object.create({
        id:'77d0c04b-b71a-485b-9573-9101cc288a0f',
        title:'Assessment 1',
        createdDate:1477021500,
        modifiedDate:1477021500,
        dueDate:1478617433000,
        totalStudents:12,
        totalAttempts:15,
        attempts:2,
        questions:['question1','question2','question3'],
        learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        settings:{
          navigation:'Forward only',
          showScore:'Per question',
          answerKey:true
        }
      }),
      Ember.Object.create({
        id:'77d0c04b-b71a-485b-9573-9101cc288a0f',
        title:'Assessment 2',
        standards:'',
        createdDate:1474072003426,
        modifiedDate:1474072003426,
        dueDate:1478617433000,
        totalAttempts:15,
        attempts:2,
        totalStudents:15,
        questions:['question1','question2','question3'],
        learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        settings:{
          navigation:'Forward only',
          showScore:'Per question',
          answerKey:false
        }
      }),
      Ember.Object.create({
        id:'77d0c04b-b71a-485b-9573-9101cc288a0f',
        title:'Assessment 3 Not Started',
        standards:'',
        createdDate:1475859664000,
        modifiedDate:1475859664000,
        dueDate:1478617433000,
        totalStudents:20,
        totalAttempts:15,
        attempts:2,
        questions:['question1','question2','question3'],
        learningObjective:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        settings:{
          navigation:'Forward only',
          showScore:'Per question',
          answerKey:false
        }
      })]);

    //TODO GET FROM QUIZZES API
    let studentList = this.get('configurationService.configuration.properties.students');


    let assigned = this.get('contextService').getContextAssignees('77d0c04b-b71a-485b-9573-9101cc288a0f');

    let isTeacher = params.isTeacher  === 'true';


    return Ember.RSVP.hash({
      profileId,
      isTeacher,
      assignments: isTeacher ? assignmentsTeacher : assignments,
      studentList,
      assigned
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    let assignedStudents = [];
    let students = [];

    controller.set('profileId',model.profileId);
    controller.set('isTeacher',model.isTeacher);
    if(model.assigned){
      assignedStudents = model.assigned.getEach('id');
      if(model.studentList){
        students = model.studentList.map(function(student) {
          let studentObject = Profile.create(student);
          studentObject.set('isAssigned',assignedStudents.includes(student.id));
          return studentObject;
        });
      }
    }
    controller.set('students',students);
    controller.set('assignments',model.assignments);
  }
});
