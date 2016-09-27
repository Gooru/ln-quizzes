/*import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';
import DS from 'ember-data';
import tHelper from "ember-i18n/helper";

// Stub performance service
const performanceServiceStub = Ember.Service.extend({
  findClassPerformanceByUnitAndLesson(classId, courseId, unitId, lessonId, classMembers){
    let response;
    let promiseResponse;

    response = Ember.Object.create({
      calculateAverageScoreByItem: function() {
        return '25';
      }
    });

    promiseResponse = new Ember.RSVP.Promise(function(resolve) {
      Ember.run.next(this, function() {
        resolve(response);
      });
    });

    // Simulate async data returned by the service
    return DS.PromiseArray.create({
      promise: promiseResponse
    });
  },
  findStudentPerformanceByLesson(userId, classId, courseId, unitId, lessonId, collections) {
    var response;
    var promiseResponse;

    if (Ember.isArray(collections)) {
      response = collections;
    } else {
      if (classId === '111-333-555' &&
        courseId === '222-444-666' &&
        unitId === '777-999' && lessonId === '888-000') {
        response = [
          Ember.Object.create({
            id: "item-1",
            collectionType: "collection",
            title: "Collection 1",
            visibility: true
          }),
          Ember.Object.create({
            id: "item-2",
            collectionType: "collection",
            title: "Collection 2",
            visibility: false
          }),
          Ember.Object.create({
            id: "item-3",
            collectionType: "assessment",
            isAssessment: true,
            isOnAir: true,
            title: "Assessment 1",
            visibility: true
          })
        ];
      } else {
        response = [];
      }
    }

    promiseResponse = new Ember.RSVP.Promise(function(resolve) {
      Ember.run.next(this, function() {
        resolve(response);
      });
    });

    // Simulate async data returned by the service
    return DS.PromiseArray.create({
      promise: promiseResponse
    });
  },

  findCourseMapPerformanceByUnitAndLesson(classId, courseId, unitId, lessonId) {
    var response;
    var promiseResponse;

    if (classId === '111-333-555' &&
          courseId === '222-444-666' &&
            unitId === '777-999' && lessonId === '888-000') {
      response = Ember.Object.create({
          calculateAverageScoreByItem: function(){
            return 1;
          }
        });
    } else {
      response = null;
    }

    promiseResponse = new Ember.RSVP.Promise(function(resolve) {
      Ember.run.next(this, function() {
        resolve(response);
      });
    });

    // Simulate async data returned by the service
    return DS.PromiseObject.create({
      promise: promiseResponse
    });
  }
});

// Stub unit service
const collectionServiceStub = Ember.Service.extend({

  findByClassAndCourseAndUnitAndLesson(classId, courseId, unitId, lessonId) {
    var response;
    var promiseResponse;

    if (classId === '111-333-555' &&
          courseId === '222-444-666' &&
            unitId === '777-999' && lessonId === '888-000') {
      response = [
        Ember.Object.create({
          id: "item-1",
          collectionType: "collection",
          title: "Collection 1",
          visibility: true
        }),
        Ember.Object.create({
          id: "item-2",
          collectionType: "collection",
          title: "Collection 2",
          visibility: false
        }),
        Ember.Object.create({
          id: "item-3",
          collectionType: "assessment",
          isAssessment: true,
          isOnAir: true,
          title: "Assessment 1",
          visibility: true
        }),
        Ember.Object.create({
          id: "item-3",
          collectionType: "assessment",
          isAssessment: true,
          isOnAir: true,
          title: "Assessment 2",
          visibility: true
        })
      ];
    } else {
      response = [];
    }

    promiseResponse = new Ember.RSVP.Promise(function(resolve) {
      Ember.run.next(this, function() {
        resolve(response);
      });
    });

    // Simulate async data returned by the service
    return DS.PromiseArray.create({
      promise: promiseResponse
    });
  }
});

const courseLocationStub = Ember.Service.extend({

  findByCourseAndUnitAndLesson(courseId, unitId, lessonId) {
    var response;
    const users = [
      Ember.Object.create({
        isActive: false,
        user: Ember.Object.create({
          id: 1,
          firstName: "John",
          lastName: "Fitzgerald",
          fullName: "Fitzgerald, John"
        })
      })
    ];

    if (courseId === '222-444-666' && unitId === '777-999' && lessonId === '888-000') {
      response = [
        Ember.Object.create({
          unit: '777-999',
          lesson: '888-000',
          collection: 'item-1',
          locationUsers: DS.PromiseArray.create({
            promise: new Ember.RSVP.resolve(users)
          })
        })
      ];
    } else {
      response = Ember.A();
    }

    return DS.PromiseArray.create({
      promise: new Ember.RSVP.resolve(response)
    });
  }
});

const lessonServiceStub = Ember.Service.extend({
  fetchById: function(courseId, unitId, lessonId) {
    let collections = [];
    if (lessonId === 'lesson-with-collections') {
      collections = [
        Ember.Object.create({id: 'collection-id-1', title: 'collection-1', collectionType: 'collection'}),
        Ember.Object.create({id: 'collection-id-2', title: 'collection-2', collectionType: 'collection'}),
        Ember.Object.create({id: 'assessment-id-1', title: 'collection-3', collectionType: 'assessment', classroom_play_enabled:false}),
        Ember.Object.create({id: 'assessment-id-2', title: 'collection-4', collectionType: 'assessment', classroom_play_enabled:true})
      ];
    }
    var lesson = Ember.Object.create({
      id: lessonId,
      title: 'Lesson Title',
      completed: 5,
      total: 10,
      children: collections
    });
    return new Ember.RSVP.Promise(function(resolve) {
      resolve(lesson);
    });
  }
});

moduleForComponent('class/overview/gru-accordion-lesson', 'Integration | Component | class/overview/gru accordion lesson', {
  integration: true,
  beforeEach: function() {
    this.i18n=this.container.lookup('service:i18n');
    this.i18n.set('locale', 'en');

    this.registry.register('helper:t', tHelper);

    this.register('service:api-sdk/collection', collectionServiceStub);
    this.inject.service('api-sdk/collection', { as: 'collectionService' });

    this.register('service:api-sdk/course-location', courseLocationStub);
    this.inject.service('api-sdk/course-location', { as: 'courseLocationService' });

    this.register('service:api-sdk/performance', performanceServiceStub);
    this.inject.service('api-sdk/performance', { as: 'performanceService' });

    this.register('service:api-sdk/lesson', lessonServiceStub);
    this.inject.service('api-sdk/lesson', { as: 'lessonService' });

  }
});

// TODO JBP Fix this!!
/*
test('it renders', function(assert) {
  const context = this;

  // Class with no collections per stub
  const currentClass = Ember.Object.create({
    id: "111-111-111",
    courseId: "999-999-999"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: "888-000",
    title: 'Lesson Title',

    completed: 5,
    total: 10
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('index', 0);

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    index=index }}`);

  const $component = this.$('.gru-accordion-lesson');
  assert.ok($component.length, 'Component does not have the component class');
  assert.ok($component.hasClass('panel'), 'Component should have the class "panel"');
  assert.ok($component.hasClass('panel-default'), 'Component should have the class "panel-default"');

  const $lessonHeading = $component.find('> .panel-heading');
  assert.ok($lessonHeading.length, 'Panel heading element is missing');

  const $completionChart = $lessonHeading.find('> .gru-completion-chart');
  assert.ok($completionChart.length, 'Completion chart for lesson');

  const $lessonTitle = $lessonHeading.find('> .panel-title');
  assert.ok($lessonTitle.length, 'Panel title element is missing');

  const $lessonTitleAnchor = $lessonTitle.find('> a.title');
  assert.ok($lessonTitleAnchor.length, 'Title anchor element is missing');
  assert.ok($lessonTitleAnchor.hasClass('collapsed'), 'Panel should be collapsed by default');
  assert.equal($lessonTitleAnchor.html().replace(/&nbsp;/g, " ").trim(), 'Lesson 1.  Lesson Title', 'Wrong title text');

  const $collapsePanel = $component.find('> .panel-collapse');
  assert.ok($collapsePanel.length, 'Panel element is missing');
  assert.ok($collapsePanel.hasClass('collapse'), 'Panel is missing class "collapse"');
  assert.ok(!$collapsePanel.hasClass('in'), 'Panel should not be visible by default');
  assert.equal('#' + $collapsePanel.attr('id'), $lessonTitleAnchor.attr('href'), 'Panel element should be tied to the title anchor element');

  const $panelBody = $collapsePanel.find('> .panel-body');
  assert.ok($panelBody.length, 'Panel body element is missing');

  const $collectionsContainer = $panelBody.find('> .collections');
  assert.ok($collectionsContainer.length, 'Container for collections and assessments is missing');

  // Content for collections/assessments is not available because the call to get data has not been made yet
  assert.equal($collectionsContainer.text().trim(), context.get('i18n').t('common.contentUnavailable').string, 'Content for collections/assessments should not be available');
});
*/

// TODO JBP Fix this!!
/*
test('it renders correctly when there are no collections/assessments to load after clicking on the lesson name', function(assert) {
  assert.expect(7);

  const context = this;

  // Class with no lessons per stub
  const currentClass = Ember.Object.create({
    id: "111-111-111",
    courseId: "999-999-999"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: "lesson-with-out-collections-id",
    title: 'Lesson Title',
    completed: 5,
    total: 10
  });

  this.on('externalAction', function () {
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('index', 0);

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    index=index
                    onSelectLesson=(action 'externalAction') }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('> .panel-heading a.title');

  const $collapsePanel = $component.find('> .panel-collapse');
  assert.ok(!$collapsePanel.hasClass('in'), 'Panel should not be visible');

  const $collectionsContainer = $collapsePanel.find('.collections');

  // Content for lessons is not available because the call to get data has not been made yet
  assert.equal($collectionsContainer.text().trim(), context.get('i18n').t('common.contentUnavailable').string, 'Content for collections/assessments should not be available');

  // Click on the lesson name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  assert.ok($collapsePanel.hasClass('in'), 'Panel should be visible');

  var $loadingSpinner = $collapsePanel.find('.three-bounce-spinner');
  assert.ok($loadingSpinner.length, 'Loading spinner should be displayed');

  return wait().then(function() {
    $loadingSpinner = $collapsePanel.find('.three-bounce-spinner');
    assert.ok(!$loadingSpinner.length, 'Loading spinner should have been hidden');

    const $items = $collapsePanel.find('.collections .panel');
    assert.equal($items.length, 0, 'Incorrect number of collections listed');
    assert.equal($collectionsContainer.text().trim(), context.get('i18n').t('common.contentUnavailable').string, 'Incorrect message when there are no collections to load');
  });
});
*/

// TODO JBP Fix this!!
/*
test('it loads collections/assessments and renders them correctly after clicking on the lesson name', function(assert) {
  const context = this;

  // Class with lessons per stub
  var currentClass = Ember.Object.create({
    id: "111-333-555",
    courseId: "222-444-666"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: 'lesson-with-collections',
    title: 'Lesson Title',
    completed: 5,
    total: 10
  });

  this.on('externalAction', function () {
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('index', 0);
  this.set('resourceId', 'item-3');

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    index=index
                    onSelectLesson=(action 'externalAction')
                    currentResource=resourceId }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('> .panel-heading a.title');

  const $collapsePanel = $component.find('> .panel-collapse');
  assert.ok(!$collapsePanel.hasClass('in'), 'Panel should not be visible');

  const $collectionsContainer = $collapsePanel.find('.collections');

  // Content for lessons is not available because the call to get data has not been made yet
  assert.equal($collectionsContainer.text().trim(), context.get('i18n').t('common.contentUnavailable').string, 'Content for collections/assessments should not be available');

  // Click on the lesson name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  assert.ok($collapsePanel.hasClass('in'), 'Panel should be visible');

  var $loadingSpinner = $collectionsContainer.find('.three-bounce-spinner');
  assert.ok($loadingSpinner.length, 'Loading spinner should be displayed');

  return wait().then(function() {
    $loadingSpinner = $collectionsContainer.find('.three-bounce-spinner');
    assert.ok(!$loadingSpinner.length, 'Loading spinner should have been hidden');

    const $items = $collapsePanel.find('.collections .panel');
    assert.equal($items.length, 3, 'Incorrect number of resources listed');

    const $collection = $items.first();
    const $assessment = $items.last();
    //const $onAirAssessment = $items.eq(1);

    const $locationMarker = $collection.find('> .location-marker');
    assert.ok($locationMarker.length, 'Location marker');

    const $collectionHeading = $collection.find('> .panel-heading');
    assert.ok($collectionHeading.length, 'Panel heading');

    const $collectionName = $collectionHeading.find('> .panel-title');
    assert.ok($collectionName.length, 'Panel title');

    const $collectionIcons = $collectionHeading.find('> .icon-container');
    assert.ok($collectionIcons.length, 'Collection panel heading: icon container');
    assert.ok($collectionIcons.find('.gru-icon.apps'), 'Icon container: collection icon');

    const $assessmentHeading = $assessment.find('> .panel-heading');
    assert.ok($assessmentHeading.length, 'Panel heading');

    const $assessmentIcons = $assessmentHeading.find('> .icon-container');
    assert.ok($assessmentIcons.length, 'Assessment panel heading: icon container');
    assert.ok($assessmentIcons.find('span.score'), 'Icon container: assessment percentage');
    assert.ok($assessmentIcons.find('i.on-air'), 'Icon container: on air icon');

    // TODO Enable these tests once Integration with API 3.0 is done
    //assert.ok($collection.hasClass('collection'), 'First resource should have the class "collection"');
    //assert.ok($assessment.hasClass('assessment'), 'Last resource should have the class "assessment"');
    //assert.ok($assessment.hasClass('selected'), 'Last resource should have the class "selected"');
    //assert.ok($assessment.hasClass('on-air'), 'Assessment on air');
    //assert.ok(!$onAirAssessment.hasClass('on-air'), 'Assessment not on air');
    //
    //assert.equal($collection.find('.panel-title a.title').html().replace(/&nbsp;/g, " ").trim(), '1.  Collection 1', 'Incorrect first resource title');
    //assert.equal($assessment.find('.panel-title a.title').html().replace(/&nbsp;/g, " ").trim(), '3.  Assessment 1', 'Incorrect last resource title');
    //
    //assert.equal($collection.find('.panel-heading .gru-user-icons.visible-xs .first-view li').length, 1, 'Wrong number of user icons showing for the first resource for mobile');
    //assert.equal($assessment.find('.panel-heading .gru-user-icons.visible-xs .first-view li').length, 1, 'Wrong number of user icons showing for the last resource for mobile');
    //
    //assert.equal($collection.find('.panel-heading .gru-user-icons.hidden-xs .first-view li').length, 1, 'Wrong number of user icons showing for the first resource');
    //assert.equal($assessment.find('.panel-heading .gru-user-icons.hidden-xs .first-view li').length, 0, 'Wrong number of user icons showing for the last resource');
  });
});
*/

// TODO JBP Fix this!!
/*
test('it loads collections/assessments and renders them correctly for teacher', function (assert) {
  //const context = this;

  // Class with lessons per stub
  var currentClass = Ember.Object.create({
    id: "111-333-555",
    courseId: "222-444-666"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: "lesson-with-collections",
    title: 'Lesson Title',

    completed: 5,
    total: 10
  });

  this.on('externalAction', function () {
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('index', 0);
  this.set('isTeacher', true);

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    index=index
                    onSelectLesson=(action 'externalAction')
                    isTeacher=isTeacher }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('> .panel-heading a.title');

  const $lessonScore = $component.find('> .panel-heading > .score');
  assert.ok($lessonScore.length, 'Score for lesson');

  assert.ok($component.find('.collections').hasClass('teacher'), 'Teacher class applied to content');

  // Click on the lesson name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  return wait().then(function () {

    const $items = $component.find('.collections .panel');
    assert.equal($items.length, 3, 'Incorrect number of resources listed');

    // TODO Enable these tests once Integration with API 3.0 is done
    //const $assessment = $items.last();
    //const $onAirAssessment = $items.eq(1);
    //
    //assert.ok($assessment.find('> button.on-air').length, 'Button on-air');
    //assert.equal($assessment.find('> button.on-air').text().trim(), context.get('i18n').t('common.launch-on-air').string, 'Button on-air: text');
    //
    //const $assessmentHeading = $assessment.find('> .panel-heading');
    //assert.ok($assessmentHeading.length, 'Panel heading');
    //
    //const $assessmentIcons = $assessmentHeading.find('> .icon-container');
    //assert.ok($assessmentIcons.length, 'Assessment panel heading: icon container');
    //assert.ok($assessmentIcons.find('span.score'), 'Icon container: assessment percentage');
    //assert.ok($assessmentIcons.find('i.on-air'), 'Icon container: on air icon');
    //
    //assert.ok($assessment.hasClass('on-air'), 'Assessment on air');
    //assert.ok(!$onAirAssessment.hasClass('on-air'), 'Assessment not on air');
  });
});
*/

// TODO JBP Fix this!!
/*
test('it only loads collections/assessments once after clicking on the lesson name', function (assert) {
  assert.expect(5);

  const context = this;

  // Class with lessons per stub
  var currentClass = Ember.Object.create({
    id: "111-333-555",
    courseId: "222-444-666"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: 'lesson-with-collections',
    title: 'Lesson Title',
    completed: 5,
    total: 10,
    children: [
      Ember.Object.create({id: 'id-1', title: 'collection-1'}),
      Ember.Object.create({id: 'id-2', title: 'collection-2'}),
      Ember.Object.create({id: 'id-3', title: 'collection-3'})
    ]
  });

  this.on('externalAction', function () {
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('index', 0);

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    index=index
                    onSelectLesson=(action 'externalAction') }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('.panel-heading .panel-title a.title');

  const $collapsePanel = $component.find('.panel-collapse');

  // Click on the unit name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  return wait().then(function() {

    // Assert that the data has been loaded
    const $items = $collapsePanel.find('.collections .panel');
    assert.equal($items.length, 3, 'Incorrect number of collections listed');

    // Click on the unit name to close the panel with the collections
    $lessonTitleAnchor.click();
    assert.ok(!$collapsePanel.hasClass('in'), 'Panel should have been hidden');

    // To test that the data will not be reloaded after clicking on the unit name
    // the class information will be changed to a class that does not have any lessons (per the stub)
    // Then, after clicking on the unit name again, assert that the lessons data has not changed.
    var currentClass = Ember.Object.create({
      id: "111-111-111",
      courseId: "999-999-999"
    });

    context.set('currentClass', currentClass);

    // Another piece of data is also changed to assert that the component does update with this change
    context.set('index', 2);

    // Click on the unit name to show the panel again
    $lessonTitleAnchor.click();
    assert.ok($collapsePanel.hasClass('in'), 'Panel should be visible');

    return wait().then(function() {

      const $items = $collapsePanel.find('.collections .panel');
      assert.equal($items.length, 3, 'Number of lessons listed should not have changed');
      assert.equal($lessonTitleAnchor.html().replace(/&nbsp;/g, " ").trim(), 'Lesson 3.  Lesson Title', 'Index in the title text should have changed');
    });
  });
});
*/

// TODO JBP Fix this!!
/*
test('it triggers event handlers', function (assert) {
  assert.expect(5);

  // Class with lessons per stub
  var currentClass = Ember.Object.create({
    id: "111-333-555",
    courseId: "222-444-666"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: "lesson-with-collections",
    title: 'Lesson Title',

    completed: 5,
    total: 10
  });

  this.on('selectResource', function (lessonId, collectionId) {
    assert.equal(collectionId, 'collection-id-1', "findStudentPerformanceByUnittion id");
    assert.equal(lessonId, 'lesson-with-collections', "Invalid lesson id");
  });

  this.on('selectLesson', function(selectedLessonId) {
    assert.equal(selectedLessonId, 'lesson-with-collections');
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    onSelectResource=(action 'selectResource')
                    onSelectLesson=(action 'selectLesson') }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('> .panel-heading a');
  const $collapsePanel = $component.find('> .panel-collapse');

  // Click on the lesson name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  return wait().then(function () {

    const $items = $collapsePanel.find('.collections .panel');
    assert.equal($items.length, 3, 'Incorrect number of resources listed');

    const $firstResource = $items.first();
    const $resourceNameAnchor = $firstResource.find('> .panel-heading > .panel-title a');
    assert.ok($resourceNameAnchor.length, 'Anchor for the first resource was not found');

    $resourceNameAnchor.click();
  });
});
*/

// TODO JBP Fix this!!
/*
test('it can start expanded (via "parsedLocation") and be collapsed manually', function (assert) {
  assert.expect(2);

  // Class with lessons per stub
  var currentClass = Ember.Object.create({
    id: "111-333-555",
    courseId: "222-444-666"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: "888-000",
    title: 'Lesson Title',

    completed: 5,
    total: 10
  });

  this.on('externalAction', function () {
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('locationArray', ['777-999', '888-000', 'item-3']);

  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    onSelectLesson=(action 'externalAction')
                    parsedLocation=locationArray }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('> .panel-heading a');
  const $collapsePanel = $component.find('> .panel-collapse');

  assert.ok($collapsePanel.hasClass('in'), 'Panel should be visible');

  // Click on the lesson name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  return wait().then(function () {
    assert.ok(!$collapsePanel.hasClass('in'), 'Panel should have been hidden');
  });
});
*/

// TODO JBP Fix this!!
/*
test('it can be expanded manually and collapsed by changing the "parsedLocation" value', function (assert) {
  assert.expect(3);

  const context = this;

  // Class with lessons per stub
  var currentClass = Ember.Object.create({
    id: "111-333-555",
    courseId: "222-444-666"
  });

  // Lesson model
  const lesson = Ember.Object.create({
    id: "888-000",
    title: 'Lesson Title',

    completed: 5,
    total: 10
  });

  this.on('externalAction', function () {
  });

  this.set('currentClass', currentClass);
  this.set('unitId', '777-999');
  this.set('lesson', lesson);
  this.set('locationArray', []);


  this.render(hbs`{{class/overview/gru-accordion-lesson
                    currentClass=currentClass
                    unitId=unitId
                    model=lesson
                    onSelectLesson=(action 'externalAction')
                    parsedLocation=locationArray }}`);

  const $component = this.$('.gru-accordion-lesson');
  const $lessonTitleAnchor = $component.find('> .panel-heading a');
  const $collapsePanel = $component.find('> .panel-collapse');

  assert.ok(!$collapsePanel.hasClass('in'), 'Panel should not be visible');

  // Click on the lesson name
  Ember.run(() => {
    $lessonTitleAnchor.click();
  });

  return wait().then(function () {
    assert.ok($collapsePanel.hasClass('in'), 'Panel should be visible');

    context.set('locationArray', ['111-111']);
    assert.ok(!$collapsePanel.hasClass('in'), 'Panel should have been hidden');
  });
});
*/
