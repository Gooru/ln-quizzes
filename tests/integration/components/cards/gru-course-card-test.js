import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'quizzes/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent('cards/gru-course-card', 'Integration | Component | cards/gru course card', {
  integration: true,
  beforeEach: function () {
    this.container.lookup('service:i18n').set("locale","en");
  }
});

test('Course Card Layout', function(assert) {
  var course = Ember.Object.create({
    'title': 'Water cycle',
    'totalUnits': 8,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false,
    'originalCreatorId':'some-id',
    'owner': Ember.Object.create({
      id:'some-id'
    }),
    'remixedBy':  Ember.A([Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-1',
      'fullName': 'lastname-1 firstname-1',
      'id': 'id-1',
      'lastName': 'lastname-1',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-1'
    }),Ember.Object.create({
      'email': 'user_2@test.com',
      'firstName': 'firstname-2',
      'fullName': 'lastname-2 firstname-2',
      'id': 'id-2',
      'lastName': 'lastname-2',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-2'
    }),Ember.Object.create({
      'email': 'user_3@test.com',
      'firstName': 'firstname-3',
      'fullName': 'lastname-3 firstname-3',
      'id': 'id-1',
      'lastName': 'lastname-3',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-3'
    })])
  });

  this.set('course', course);
  assert.expect(10);
  this.render(hbs`{{cards/gru-course-card course=course}}`);

  var $component = this.$(); //component dom element
  const $courseCard = $component.find(".gru-course-card");
  T.exists(assert, $courseCard, "Missing course card section");
  T.exists(assert, $courseCard.find(".course-title"), "Missing course card title");
  T.exists(assert, $courseCard.find(".total-units"), "Missing total units");
  T.exists(assert, $courseCard.find(".subject"), "Missing subject");
  T.exists(assert, $courseCard.find(".icon.public"), "Missing public icon");
  T.exists(assert, $courseCard.find(".created"), "Missing Created By");
  T.exists(assert, $courseCard.find(".users-teaser"), "Missing users teaser");
  T.exists(assert, $courseCard.find(".remix-button  button"), "Missing remix button");
  T.exists(assert, $courseCard.find(".visibility  .gru-icon"), "Missing visibility icon");
  T.notExists(assert, $courseCard.find(".play-button  button"), "Play button should not appear");
});


test('Course Card Private', function(assert) {
  var course = Ember.Object.create({
    'title': 'Water cycle',
    'totalUnits': 8,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':false,
    'isVisibleOnProfile':false,
    'remixedBy':  Ember.A([Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-1',
      'fullName': 'lastname-1 firstname-1',
      'id': 'id-1',
      'lastName': 'lastname-1',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-1'
    }),Ember.Object.create({
      'email': 'user_2@test.com',
      'firstName': 'firstname-2',
      'fullName': 'lastname-2 firstname-2',
      'id': 'id-2',
      'lastName': 'lastname-2',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-2'
    }),Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-3',
      'fullName': 'lastname-3 firstname-3',
      'id': 'id-1',
      'lastName': 'lastname-3',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-3'
    })])
  });

  this.set('course', course);
  assert.expect(2);
  this.render(hbs`{{cards/gru-course-card course=course}}`);

  var $component = this.$(); //component dom element
  const $courseCard = $component.find(".gru-course-card");
  T.notExists(assert, $courseCard.find(".icon"), "Icon should not appear");
  T.notExists(assert, $courseCard.find(".remix-button  button"), "Remix Button should not appear");
});

test('Course Card Layout Owner and Public', function(assert) {
  var course = Ember.Object.create({
    'title': 'Water cycle',
    'totalUnits': 8,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false,
    'originalCreatorId':'some-id',
    'owner': Ember.Object.create({
      'id':'some-other-id'
    }),
    'isRemixed': true,
    'remixedBy':  Ember.A([Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-1',
      'fullName': 'lastname-1 firstname-1',
      'id': 'id-1',
      'lastName': 'lastname-1',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-1'
    }),Ember.Object.create({
      'email': 'user_2@test.com',
      'firstName': 'firstname-2',
      'fullName': 'lastname-2 firstname-2',
      'id': 'id-2',
      'lastName': 'lastname-2',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-2'
    }),Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-3',
      'fullName': 'lastname-3 firstname-3',
      'id': 'id-1',
      'lastName': 'lastname-3',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-3'
    })])
  });

  this.set('course', course);
  assert.expect(9);
  this.render(hbs`{{cards/gru-course-card course=course isOwner=true isEditEnabled=true}}`);

  var $component = this.$(); //component dom element
  const $courseCard = $component.find(".gru-course-card");
  T.exists(assert, $courseCard, "Missing course card section");
  T.exists(assert, $courseCard.find(".course-title"), "Missing course card title");
  T.exists(assert, $courseCard.find(".total-units"), "Missing total units");
  T.exists(assert, $courseCard.find(".subject"), "Missing subject");
  T.exists(assert, $courseCard.find(".icon.public"), "Missing public icon");
  T.exists(assert, $courseCard.find(".visibility  .gru-icon"), "Missing visibility icon");
  T.exists(assert, $courseCard.find(".remixed"), "Missing Remixed By");
  T.exists(assert, $courseCard.find(".users-teaser"), "Missing users teaser");
  T.exists(assert, $courseCard.find(".edit-button  button"), "Missing edit button");
});

test('Course Card Layout Owner and Private', function(assert) {
  var course = Ember.Object.create({
    'title': 'Water cycle',
    'totalUnits': 8,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':false,
    'isVisibleOnProfile':true,
    'remixedBy':  Ember.A([Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-1',
      'fullName': 'lastname-1 firstname-1',
      'id': 'id-1',
      'lastName': 'lastname-1',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-1'
    }),Ember.Object.create({
      'email': 'user_2@test.com',
      'firstName': 'firstname-2',
      'fullName': 'lastname-2 firstname-2',
      'id': 'id-2',
      'lastName': 'lastname-2',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-2'
    }),Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-3',
      'fullName': 'lastname-3 firstname-3',
      'id': 'id-1',
      'lastName': 'lastname-3',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-3'
    })])
  });

  this.set('course', course);
  assert.expect(9);
  this.render(hbs`{{cards/gru-course-card course=course isOwner=true isEditEnabled=true}}`);

  var $component = this.$(); //component dom element
  const $courseCard = $component.find(".gru-course-card");
  T.exists(assert, $courseCard, "Missing course card section");
  T.exists(assert, $courseCard.find(".course-title"), "Missing course card title");
  T.exists(assert, $courseCard.find(".total-units"), "Missing total units");
  T.exists(assert, $courseCard.find(".subject"), "Missing subject");
  T.notExists(assert, $courseCard.find(".icon .public"), "Missing public icon");
  T.exists(assert, $courseCard.find(".users-teaser"), "Missing users teaser");
  T.exists(assert, $courseCard.find(".edit-button  button"), "Missing edit button");
  T.exists(assert, $courseCard.find(".play-button  button"), "Missing play button");
  T.notExists(assert, $courseCard.find(".visibility  .gru-icon"), "Missing visibility icon");
});
test('Click Edit', function(assert) {
  var course = Ember.Object.create({
    'id': "1",
    'title': 'Water cycle',
    'totalUnits': 8,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false,
    'remixedBy':  Ember.A([Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-1',
      'fullName': 'lastname-1 firstname-1',
      'id': 'id-1',
      'lastName': 'lastname-1',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-1'
    }),Ember.Object.create({
      'email': 'user_2@test.com',
      'firstName': 'firstname-2',
      'fullName': 'lastname-2 firstname-2',
      'id': 'id-2',
      'lastName': 'lastname-2',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-2'
    }),Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-3',
      'fullName': 'lastname-3 firstname-3',
      'id': 'id-1',
      'lastName': 'lastname-3',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-3'
    })])
  });

  this.set('course', course);
  assert.expect(1);

  this.on('editCourse', function(course){
    assert.equal(course.get("id"), "1", "Wrong course id");
  });

  this.render(hbs`{{cards/gru-course-card course=course isOwner=true isEditEnabled=true onEditCourse='editCourse'}}`);
  var $component = this.$(); //component dom element
  var $editButton = $component.find(".edit-button button");
  $editButton.click();

});
test('Click Play', function(assert) {
  var course = Ember.Object.create({
    'id': "1",
    'title': 'Water cycle',
    'totalUnits': 8,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false,
    'remixedBy':  Ember.A([Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-1',
      'fullName': 'lastname-1 firstname-1',
      'id': 'id-1',
      'lastName': 'lastname-1',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-1'
    }),Ember.Object.create({
      'email': 'user_2@test.com',
      'firstName': 'firstname-2',
      'fullName': 'lastname-2 firstname-2',
      'id': 'id-2',
      'lastName': 'lastname-2',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-2'
    }),Ember.Object.create({
      'email': 'user_1@test.com',
      'firstName': 'firstname-3',
      'fullName': 'lastname-3 firstname-3',
      'id': 'id-1',
      'lastName': 'lastname-3',
      'avatarUrl': '/assets/quizzes/profile.png',
      'username': 'username-3'
    })])
  });

  this.set('course', course);
  assert.expect(1);

  this.on('playCourse', function(course){
    assert.equal(course.get("id"), "1", "Wrong course id");
  });

  this.render(hbs`{{cards/gru-course-card course=course isOwner=true isEditEnabled=true onPlayCourse='playCourse'}}`);
  var $component = this.$(); //component dom element
  var $playButton = $component.find(".play-button button");
  $playButton.click();

});
test('Course Card Unit Count with total 1', function(assert) {
  var course = Ember.Object.create({
    'id': "1",
    'title': 'Water cycle',
    'unitCount': 1,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false
  });

  this.set('course', course);
  assert.expect(1);

  this.render(hbs`{{cards/gru-course-card course=course isOwner=true}}`);
  var $component = this.$(); //component dom element
  var $unit =$component.find(".total-units");
  assert.equal(T.text($unit),"1 Unit");

});
test('Course Card Unit Count more than one', function(assert) {
  var course = Ember.Object.create({
    'id': "1",
    'title': 'Water cycle',
    'unitCount': 2,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false
  });

  this.set('course', course);
  assert.expect(1);

  this.render(hbs`{{cards/gru-course-card course=course isOwner=true}}`);
  var $component = this.$(); //component dom element
  var $unit =$component.find(".total-units");
  assert.equal(T.text($unit),"2 Units");

});
test('Course Card Unit Count zero', function(assert) {
  var course = Ember.Object.create({
    'id': "1",
    'title': 'Water cycle',
    'unitCount':null,
    'subjects': ['Science'],
    'imageUrl': '/assets/quizzes/profile.png',
    'isPublished':true,
    'isVisibleOnProfile':false
  });

  this.set('course', course);
  assert.expect(1);

  this.render(hbs`{{cards/gru-course-card course=course isOwner=true}}`);
  var $component = this.$(); //component dom element
  var $unit =$component.find(".total-units");
  assert.equal(T.text($unit),"0 Units");

});
