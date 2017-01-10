import Ember from 'ember';
import { getGradeColor } from 'quizzes/utils/utils';
import { GRADING_SCALE } from 'quizzes/config/config';
import { average } from 'quizzes/utils/math';

/**
 * Class assessment summary
 *
 * Component responsible for aggregating the class assessment data
 * and presenting it in a summarized manner to the user
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'gru-summary'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * @function actions:toggleView
     * @param {boolean} isQuestionView - Should all the questions be visible or not?
     */
    toggleView: function (isQuestionView) {
      this.set('isQuestionView', isQuestionView);
    },

    /**
     * @function actions:selectQuestion
     * @param {Number} questionId
     */
    selectQuestion: function (questionId) {
      this.get('onSelectQuestion')(questionId);
    }

  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * @prop { Object[] } answersData - Array that keeps track of all the correct and incorrect answers
   * for each student taking an assessment
   *
   * Each object will consist of:
   * - correct: number of questions that the student has answered correctly
   * - incorrect: number of questions that the student has answered incorrectly
   */
  answersData: Ember.computed('reportData.reportEvents.@each.currentResourceId', function () {
    const reportEvents = this.get('reportData.reportEvents');

    let answers = [];
    reportEvents.forEach(function (reportEvent) {
      let answerCounter = {
        correct: 0,
        incorrect: 0
      };
      answers.push(answerCounter);

      reportEvent.get('questionResults').forEach(function (questionResult) {
        if(questionResult.get('started')) {
          answerCounter.correct += questionResult.get('correct') ? 1 : 0;
          answerCounter.incorrect += questionResult.get('incorrect') ? 1 : 0;
        }
      });
    });

    return answers;
  }),

  /**
   * @prop { Collection } assessment
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { String[] } assessmentQuestionsIds - An array with the ids of all the questions in the assessment
   * ordered in ascending order per each question's order value.
   */
  assessmentQuestionsIds: Ember.computed('assessment.resources.@each.id', function () {

    let questions = this.get('assessment.resourcesSorted').map(function (question) {
      // Copy only the most important properties of the resources array
      return {
        id: question.id,
        order: question.sequence
      };
    });

    return questions.sort((a, b) => a.order - b.order).map(question => question.id);
  }),

  /**
   * @prop { Object[] } assignmentScores - Aggregate data of the scores in the assessment
   * (to be consumed by the pie chart component)
   *
   * Each object will consist of:
   * - color: color corresponding to a grade bracket in the grading scale (@see /app/config/config.js)
   * - value: percentage of students in the class with a score within said grade bracket
   */
  assignmentScores: Ember.computed('scoresData', function () {
    const scoresData = this.get('scoresData');
    const scoresColors = scoresData.map(result => getGradeColor(result.score));
    const colors = GRADING_SCALE.map(item => item.COLOR);

    let results = [];
    if (scoresColors.length) {
      let scoreColorsLen = scoresColors.length;
      colors.forEach(function (color) {
        // Count the number of appearances of a certain color
        let numColor = scoresColors.filter(scoreColor => scoreColor === color).length;
        if (numColor) {
          results.push({
            color,
            value: Math.round(numColor / scoreColorsLen * 100)
          });
        }
      });
    }
    return results;
  }),

  /**
   * @prop { number } averageScore - average score in the assessment
   * for the entire group of students (per scoresData)
   */
  averageScore: Ember.computed('scoresData', function () {
    let scores = this.get('scoresData').map(result => result.score);
    return scores.length ? Math.round(average(scores)) : 0;
  }),

  /**
   * @prop { boolean } isFullScreen - Should the overview be visible or not?
   */
  isFullScreen: false,

  /**
   * @prop { boolean } isQuestionView - Should all the questions be visible or not?
   */
  isQuestionView: false,

  /**
   * @prop { Object[] } questionsData - Array that keeps track of all the correct/incorrect answers
   * for each question in the assessment
   *
   * For each question, there will be a counter object with the following properties:
   * - id: question id
   * - correct: number of students that have answered the question correctly
   * - incorrect: number of students that did not answer the question correctly
   * - total: total number of students
   */
  questionsData: Ember.computed('reportData.reportEvents.@each.currentResourceId', function () {
    const studentsIds = this.get('studentsIds');
    const totalStudents = studentsIds.length;
    const questionsIds = this.get('assessmentQuestionsIds');
    const reportEvents = this.get('reportData.reportEvents');

    let questions = [];

    questionsIds.forEach(function (question) {
      let questionCounter = {
        id: question,
        correct: 0,
        incorrect: 0,
        total: totalStudents
      };
      questions.push(questionCounter);

      reportEvents.forEach(function (student) {
        let resourceResults = student.get('resourceResults').filter(result => result.resourceId === question);
        resourceResults.forEach(questionResult => {
          if(questionResult.get('started')) {
            questionCounter.correct += questionResult.get('correct') ? 1 : 0;
            questionCounter.incorrect += questionResult.get('incorrect') ? 1 : 0;
          }
        });
      });
    });
    return questions;
  }),

  /**
   * @prop { ReportData } reportData
   */
  reportData: null,

  /**
   * @prop { Object[] } scoresData - Array with all the scores in the assessment
   *
   * Each object corresponds to an assessment result by a student and will consist of:
   * - score: number of questions answered correctly vs. total number of questions
   * - completed: have all the questions in the assessment been answered?
   */
  scoresData: Ember.computed('answersData.@each.correct', 'answersData.@each.incorrect', function () {
    const answersData = this.get('answersData');
    const totalQuestions = this.get('assessmentQuestionsIds').length;

    let answerIdx = answersData.length - 1;
    let results = [];

    for (; answerIdx >= 0; answerIdx--) {
      let correct = answersData[answerIdx].correct;
      let totalAnswered = correct + answersData[answerIdx].incorrect;

      if (totalAnswered > 0) {
        let score = Math.round(correct / totalAnswered * 100);
        results.push({
          score,
          completed: totalAnswered === totalQuestions
        });
      }
    }

    return results;
  }),

  /**
   * @prop { String[] } studentsIds - An array with the ids of all the students taking the assessment
   */
  studentsIds: Ember.computed.alias('reportData.studentIds'),

  /**
   * @prop { Number } totalCompleted - Number of students that have completed the assessment
   */
  totalCompleted: Ember.computed('scoresData.@each.completed', function () {
    const scoresData = this.get('scoresData');
    return !scoresData.length ? 0 :
      scoresData.map(result => result.completed ? 1 : 0)
        .reduce((a, b) => a + b);
  })

});
