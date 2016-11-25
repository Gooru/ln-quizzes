import Ember from 'ember';
import {
  alphabeticalStringSort,
  formatTime,
  getAnswerResultIcon,
  getScoreString,
  getReactionIcon
} from 'quizzes/utils/utils';
import {
  averageReaction,
  correctPercentage,
  totalTimeSpent
} from 'quizzes/utils/question-result';

/**
 * Class assessment table view
 *
 * Component responsible for filtering and transforming the class assessment data
 * into a format readily consumable by the gru-two-tier-header-table component.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),


  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'class-assessment', 'gru-table-view'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * @function actions:selectQuestion
     * @param {Number} questionId
     */
    selectQuestion: function (questionId) {
      this.get('onSelectQuestion')(questionId);
    },

    /**
     * @function actions:selectStudent
     * @param {string} studentId
     */
    selectStudent: function (studentId) {
      this.get('onSelectStudent')(studentId);
    }

  },


  // -------------------------------------------------------------------------
  // Events

  init: function () {
    this._super(...arguments);
    this.set('questionProperties', this.initQuestionProperties());
    this.set('studentsHeader', this.initStudentsHeader());
  },

  willDestroyElement: function () {
    this.set('questionProperties', null);
    this.set('studentsHeader', null);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the report is displayed in anonymous mode
   * @property {boolean} anonymous
   */
  anonymous: false,

  /**
   * @prop { Collection } assessment
   */
  assessment: Ember.computed.alias('reportData.collection'),

  /**
   * @prop { Object[] } assessmentQuestions - An array made up of all the questions in the assessment
   *
   * Each question object will consist of:
   * - label: visual representation of the header
   * - value: internal header identifier
   *
   * The questions will be ordered in the array in ascending order per the order value
   */
  assessmentQuestions: Ember.computed('assessment.resources.[]', function () {
    const labelPrefix = this.get('i18n').t('reports.gru-table-view.first-tier-header-prefix').string;

    let questions = this.get('assessment.resources')
      .sortBy('sequence')
      .map(function (question, index) {
        return {
          value: question.get('id'),
          label: labelPrefix + (index + 1)
        };
      });

    // Add column used for showing totals at the beginning of the array
    questions.unshift({
      value: -1,
      label: this.get('i18n').t('reports.gru-table-view.totals').string
    });

    return questions;
  }),

  /**
   * @prop { String[] } assessmentQuestionsIds - An array with the ids of all the questions in the assessment
   */
  assessmentQuestionsIds: Ember.computed('assessmentQuestions.[]', function () {
    return this.get('assessmentQuestions').map(question => question.value);
  }),

  /**
   * @prop { Object[] } questionProperties - An array made up of question properties
   *
   * Each property object will consist of:
   * - filter: information to use for the corresponding filter checkbox
   * - label: visual representation of the header
   * - value: internal header identifier
   * - visible: should the property be visible or not?
   * - renderFunction: function to process values of this property for output
   * - aggregateFunction: if there's an aggregate column, this function will be
   *   used to aggregate all the values for this property that are in the same row
   * - aggregateRenderFunction: if there's an aggregate column, this function will
   *   take the result of the aggregateFunction and process it for output
   * - sortFunction: sort function for values of this property
   */
  questionProperties: null,

  /**
   * @prop { String[] } questionPropertiesIds - An array with the ids of all the question properties
   */
  questionPropertiesIds: Ember.computed('questionProperties', function () {
    return this.get('questionProperties')
      .map(questionProperty => questionProperty.value);
  }),

  /**
   * @prop { ReportData } reportData - Unordered 3D matrix of data to use as content for the table component
   */
  reportData: null,

  /**
   * @prop { User[] } students - Students taking the assessment
   */
  students: Ember.computed.alias('reportData.studentIds'),

  /**
   * @prop { String? } studentsHeader - Header for the students names
   */
  studentsHeader: null,

  /**
   * @prop { String[] } studentsIds - An array with the ids of all the students taking the assessment
   */
  studentsIds: Ember.computed.alias('reportData.studentIds'),

  /**
   * @prop { Object[] } tableData - Ordered data to use as content for the table component
   * It merges the existing table frame with any updated table data.
   *
   * Each object in the array will consist of:
   * - id: row id
   * - header: row header
   * - content: an array of objects making up the row content where each object is made up of:
   *   - value: table cell un-formatted content
   *   - output: table cell content formatted for output (the formatting is done by
   *             the question property's render function)
   */
  tableData: Ember.computed('anonymous', 'tableFrame', 'reportData.reportEvents', function () {
    const studentsIds = this.get('studentsIds');
    const studentsIdsLen = studentsIds.length;
    const questionsIds = this.get('assessmentQuestionsIds');
    const questionsIdsLen = questionsIds.length;
    const questionProperties = this.get('questionProperties');
    const questionPropertiesIds = this.get('questionPropertiesIds');
    const questionPropertiesIdsLen = questionPropertiesIds.length;
    const reportData = this.get('reportData.reportEvents');

    // Copy the table frame contents
    let data = this.get('tableFrame').slice(0);
    let totalIndex, propertyValues;

    // Get the value of each question property, for each question, for each student
    for (let i = 0; i < studentsIdsLen; i++) {

      // Array for storing all values of the same question property
      propertyValues = [];
      for (let k = 0; k < questionPropertiesIdsLen; k++) {
        // Put all values for the same property into an array
        propertyValues[k] = [];
      }

      for (let j = 0; j < questionsIdsLen; j++) {
        if (questionsIds[j] === -1) {
          // Save this position to fill it in last (cells with propertyValues)
          totalIndex = j;
          continue;
        }
        for (let k = 0; k < questionPropertiesIdsLen; k++) {
          let renderFunction = questionProperties[k].renderFunction;
          let questionResult = reportData[studentsIds[i]][questionsIds[j]];
          let value = questionResult[questionPropertiesIds[k]];

          data[i].content[j * questionPropertiesIdsLen + k] = {
            value: value,
            output: (!renderFunction) ? value : renderFunction(value)
          };

          propertyValues[k].push(questionResult);
        }
      }

      // Compute the aggregate values
      for (let k = 0; k < questionPropertiesIdsLen; k++) {
        // Set the value in the aggregate (totals) column;
        let value = questionProperties[k].aggregateFunction(propertyValues[k]);
        let aggregateRenderFunction = questionProperties[k].aggregateRenderFunction;

        // For displaying the aggregate value, use the question property's aggregateRenderFunction.
        // If there's no aggregateRenderFunction, use the property's renderFunction by default.
        data[i].content[totalIndex * questionPropertiesIdsLen + k] = {
          value: value,
          output: (aggregateRenderFunction) ? aggregateRenderFunction(value) :
            questionProperties[k].renderFunction(value)
        };
      }
    }

    return data;
  }),

  /**
   * @prop {Object[]} tableFrame - The table frame that encloses the table data
   * @return {Object[]}
   */
  tableFrame: Ember.computed('anonymous', 'students.[]', function () {
    let anonymous = this.get('anonymous');
    return this.get('students').map(function (student) {
      return {
        id: student.get('id'),
        header: anonymous ? student.get('code') : student.get('fullName'),
        content: []
      };
    });
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Initialize the question properties array with values -including i18n labels
   * @return {Object[]}
   */
  initQuestionProperties: function () {
    return [
      Ember.Object.create({
        filter: {
          label: this.get('i18n').t('reports.gru-table-view.scores').string,
          disabled: true
        },
        label: this.get('i18n').t('reports.gru-table-view.score').string,
        value: 'correct',
        visible: true,
        renderFunction: getAnswerResultIcon,
        aggregateFunction: correctPercentage,
        aggregateRenderFunction: getScoreString
      }),
      Ember.Object.create({
        filter: {
          label: this.get('i18n').t('reports.gru-table-view.study-time').string
        },
        label: this.get('i18n').t('reports.gru-table-view.study-time').string,
        value: 'timeSpent',
        renderFunction: formatTime,
        aggregateFunction: totalTimeSpent
      }),
      Ember.Object.create({
        filter: {
          label: this.get('i18n').t('reports.gru-table-view.reactions').string
        },
        label: this.get('i18n').t('reports.gru-table-view.reaction').string,
        value: 'reaction',
        renderFunction: getReactionIcon,
        aggregateFunction: averageReaction
      })
    ];
  },

  /**
   * Initialize the students header object with values including an i18n label
   * @return {Object[]}
   */
  initStudentsHeader: function () {
    return {
      label: this.get('i18n').t('reports.gru-table-view.student').string,
      value: 'fullName',
      sortFunction: alphabeticalStringSort
    };
  }

});
