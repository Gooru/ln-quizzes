import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    isTeacher : {}
  },

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
        assignedDate:'27/10/2016',
        dueDate:'2/11,2016',
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
            assignedDate:'27/10/2016',
            dueDate:'3/11,2016',
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
        score:null,
        title:'Assessment 3 Not Started',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'4/11,2016',
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
        score:'70',
        title:'Assessment 4',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'5/11,2016',
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
        score:'70',
        title:'Assessment 5 No more attempts',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'30/10,2016',
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
        score:'70',
        title:'Assessment 6',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'7/11,2016',
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
        score:'100',
        title:'Assessment 7',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'2/11,2016',
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
        score:'70',
        title:'Assessment 8',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'2/11,2016',
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
        score:'70',
        title:'Assessment 9',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'2/11,2016',
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
      }),Ember.Object.create({
        hasStarted:true,
        score:'70',
        title:'Assessment 10',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'2/11,2016',
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
        score:'40',
        title:'Assessment 11',
        standards:'',
        assignedDate:'27/10/2016',
        dueDate:'2/11,2016',
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

    let isTeacher = params.isTeacher;
    return Ember.RSVP.hash({
      profileId,
      isTeacher,
      assignments
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    controller.set('profileId',model.profileId);
    controller.set('isTeacher',model.isTeacher);
    controller.set('assignments',model.assignments);
  }
});
