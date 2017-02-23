/*global SockJS:true*/
import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'quizzes/tests/helpers/module-for-acceptance';
import T from 'quizzes/tests/helpers/assert';

moduleForAcceptance('Acceptance | reports/student-context');

test('Layout', function (assert) {
  assert.expect(6);
  visit('/reports/student-context/context-simple-id');

  andThen(function () {
    assert.equal(currentURL(), '/reports/student-context/context-simple-id');
    const $studentReport = find('.reports.qz-student-report');
    T.exists(assert, $studentReport, 'Missing report');
    assert.equal($studentReport.find('.summary-container .percentage').text(), '67%', 'Wrong grade');
    assert.equal($studentReport.find('.bubbles-list').children().length, 2, 'Wrong length of questions');
    const $questions = $studentReport.find('.gru-questions.performance-view');
    T.exists(assert, $questions.find('table tr:first-child .question-score .incorrect'), 'Wrong score value for first answer');
    T.exists(assert, $questions.find('table tr:last-child .question-score .correct'), 'Wrong score value for last answer');
  });
});
