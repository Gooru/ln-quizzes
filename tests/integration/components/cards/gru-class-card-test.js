import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent('cards/gru-class-card', 'Integration | Component | cards/gru class card', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale", "en");
    this.inject.service('i18n');
  }
});

var mockClass = Ember.Object.create({
  id: "class-id",
  creatorId: "creator-id",
  title: "My class - 1",
  description: "This class is intended to make awareness of good habits",
  greeting: "Hi! Welcome to my class",
  grade: [4, 5],
  classSharing: "open",
  coverImage: "cover.png",
  code: "VZFMEWH",
  minScore: 75,
  endDate: "2016-12-31",
  courseId: null,
  collaborator: [
    "collaborator-1",
    "collaborator-2"
  ],
  creatorSystem: null,
  contentVisibility: null,
  isArchived: false,
  isTeacher: function () { return true; }
});

var mockProfile = Ember.Object.create({
  id: 'test-profile',
  displayName: "test"
});

var classStudentCount = Ember.Object.create({
  'class-id': 4
});

test('Class Card Layout', function(assert) {

  this.set('class', mockClass);
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);

  assert.expect(11);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find(".gru-class-card");
  const $panel = $classCard.find(".panel");

  T.exists(assert, $classCard, "Missing class card section");
  T.exists(assert, $panel, "Missing class card panel");
  assert.ok($panel.hasClass("teacher"), "Must be a teacher class card");
  T.exists(assert, $classCard.find("h5"), "Missing class card title");
  T.exists(assert, $classCard.find(".side-info .code"), "Missing class card code");
  T.exists(assert, $classCard.find(".side-info .action"), "Missing class card action link");
  T.exists(assert, $classCard.find(".collaborators .collaborator-avatar"), "Missing collaborator avatar");
  T.exists(assert, $classCard.find(".collaborators .name"), "Missing collaborator name");
  T.exists(assert, $classCard.find(".students-info"), "Missing students info");
  T.exists(assert, $classCard.find(".description div"), "Missing class info");
  T.notExists(assert, $classCard.find(".download-report"), "Download report shouldn't be visible");

});

test('Student class card', function (assert) {
  //changing mock to be a student
  mockClass.set('isTeacher', function () {return false;});

  this.set('class', mockClass);
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);

  assert.expect(1);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount}}`);

  var $component = this.$(); //component dom element

  const $panel = $component.find(".panel");
  assert.ok($panel.hasClass("student"), "Must be a student class card");

});

test('Class with just one collaborator', function (assert) {
  mockClass.set('collaborator', ["collaborator-1"]);
  this.set('class', mockClass);
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);

  assert.expect(2);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find(".gru-class-card");
  T.exists(assert, $classCard, "Missing class card section");
  T.notExists(assert, $classCard.find(".collaborators-count"), "Collaborators count should not exist");

});

test('Class Card Layout for archived class, report available', function(assert) {

  this.set('class', Ember.Object.create({
    id: "class-id",
    creatorId: "creator-id",
    title: "My class - 1",
    description: "This class is intended to make awareness of good habits",
    greeting: "Hi! Welcome to my class",
    grade: [4, 5],
    classSharing: "open",
    coverImage: "cover.png",
    code: "VZFMEWH",
    minScore: 75,
    endDate: "2016-12-31",
    courseId: 1,
    collaborator: [
      "collaborator-1",
      "collaborator-2"
    ],
    creatorSystem: null,
    contentVisibility: null,
    isArchived: true,
    isReportAvailable: true,
    isReportInProgress: false,
    hasCourse: true,
    isTeacher: function () { return true; }
  }));
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);
  this.on('downloadReport', function(){
    assert.ok(true, "Action should be called");
  });

  assert.expect(14);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount onDownloadReport='downloadReport'}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find(".gru-class-card");
  const $panel = $classCard.find(".panel");

  T.exists(assert, $classCard, "Missing class card section");
  T.exists(assert, $panel, "Missing class card panel");
  assert.ok($panel.hasClass("teacher"), "Must be a teacher class card");
  T.exists(assert, $classCard.find("h5"), "Missing class card title");
  T.notExists(assert, $classCard.find(".side-info"), "side info shouldn't be visible");
  T.exists(assert, $classCard.find(".collaborators .collaborator-avatar"), "Missing collaborator avatar");
  T.exists(assert, $classCard.find(".collaborators .name"), "Missing collaborator name");
  T.exists(assert, $classCard.find(".students-info"), "Missing students info");
  T.exists(assert, $classCard.find(".description div"), "Missing class info");
  T.exists(assert, $classCard.find(".download-report"), "Download report should be visible");
  T.notExists(assert, $classCard.find(".report-in-progress"), "Report in progress should not be visible");
  T.notExists(assert, $classCard.find(".request-report"), "Request report should not be visible");
  T.notExists(assert, $classCard.find(".report-not-available"), "Report not available should not be visible");

  $classCard.find(".download-report").click();

});

test('Class Card Layout for archived class, report in progress', function(assert) {

  this.set('class', Ember.Object.create({
    id: "class-id",
    creatorId: "creator-id",
    title: "My class - 1",
    description: "This class is intended to make awareness of good habits",
    greeting: "Hi! Welcome to my class",
    grade: [4, 5],
    classSharing: "open",
    coverImage: "cover.png",
    code: "VZFMEWH",
    minScore: 75,
    endDate: "2016-12-31",
    courseId: 1,
    collaborator: [
      "collaborator-1",
      "collaborator-2"
    ],
    creatorSystem: null,
    contentVisibility: null,
    isArchived: true,
    isReportAvailable: false,
    isReportInProgress: true,
    hasCourse: true,
    isTeacher: function () { return true; }
  }));
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);

  assert.expect(4);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find(".gru-class-card");
  T.notExists(assert, $classCard.find(".download-report"), "Download report should not be visible");
  T.exists(assert, $classCard.find(".report-in-progress"), "Report in progress should be visible");
  T.notExists(assert, $classCard.find(".report-not-available"), "Report not available should not be visible");
  T.notExists(assert, $classCard.find(".request-report"), "Request report should not be visible");
});

test('Class Card Layout for archived class, request report', function(assert) {

  this.set('class', Ember.Object.create({
    id: "class-id",
    creatorId: "creator-id",
    title: "My class - 1",
    description: "This class is intended to make awareness of good habits",
    greeting: "Hi! Welcome to my class",
    grade: [4, 5],
    classSharing: "open",
    coverImage: "cover.png",
    code: "VZFMEWH",
    minScore: 75,
    endDate: "2016-12-31",
    courseId: 1,
    collaborator: [
      "collaborator-1",
      "collaborator-2"
    ],
    creatorSystem: null,
    contentVisibility: null,
    isArchived: true,
    isReportAvailable: false,
    isReportInProgress: false,
    hasCourse: true,
    canRequestReport: true,
    isTeacher: function () { return true; }
  }));
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);
  this.on('requestReport', function(){
    assert.ok(true, "Action should be called");
  });

  assert.expect(5);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount onRequestReport='requestReport'}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find(".gru-class-card");
  T.notExists(assert, $classCard.find(".download-report"), "Download report should not be visible");
  T.notExists(assert, $classCard.find(".report-in-progress"), "Report in progress should not be visible");
  T.notExists(assert, $classCard.find(".report-not-available"), "Report not available should not be visible");
  T.exists(assert, $classCard.find(".request-report"), "Request report should be visible");

  $classCard.find(".request-report").click();
});

test('Class Card Layout for archived class, not available', function(assert) {

  this.set('class', Ember.Object.create({
    id: "class-id",
    creatorId: "creator-id",
    title: "My class - 1",
    description: "This class is intended to make awareness of good habits",
    greeting: "Hi! Welcome to my class",
    grade: [4, 5],
    classSharing: "open",
    coverImage: "cover.png",
    code: "VZFMEWH",
    minScore: 75,
    endDate: "2016-12-31",
    courseId: null, //no course, so no report available
    collaborator: [
      "collaborator-1",
      "collaborator-2"
    ],
    creatorSystem: null,
    contentVisibility: null,
    isArchived: true,
    isReportAvailable: false,
    isReportInProgress: false,
    hasCourse: false,
    canRequestReport: false,
    isTeacher: function () { return true; }
  }));
  this.set('profile', mockProfile);
  this.set('classStudentCount', classStudentCount);

  assert.expect(4);

  this.render(hbs`{{cards/gru-class-card class=class profile=profile classStudentCount=classStudentCount}}`);

  var $component = this.$(); //component dom element

  const $classCard = $component.find(".gru-class-card");
  T.notExists(assert, $classCard.find(".download-report"), "Download report should not be visible");
  T.notExists(assert, $classCard.find(".report-in-progress"), "Report in progress should not be visible");
  T.notExists(assert, $classCard.find(".request-report"), "Request report should not be visible");
  T.exists(assert, $classCard.find(".report-not-available"), "Report not available should be visible");
});

