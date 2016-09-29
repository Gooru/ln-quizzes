import { moduleFor, test } from 'ember-qunit';
import ClassModel from 'quizzes/models/content/class';

moduleFor('serializer:content/class', 'Unit | Serializer | content/class');

test('serializeCreateClass', function(assert) {
  const serializer = this.subject();
  const classObject = ClassModel.create({
    title: 'class-title',
    classSharing: 'open',
    minScore: null
  });
  const expected = {
    title: 'class-title',
    class_sharing: 'open',
    min_score: 0
  };
  const response = serializer.serializeCreateClass(classObject);
  assert.deepEqual(expected, response, 'Wrong serialized response');
});

test('serializeUpdateClass', function(assert) {
  const serializer = this.subject();
  const classObject = ClassModel.create({
    title: 'class-title',
    classSharing: 'open',
    greeting: 'class-greeting',
    minScore: 90
  });
  const expected = {
    title: 'class-title',
    class_sharing: 'open',
    greeting: 'class-greeting',
    min_score: 90
  };
  const response = serializer.serializeUpdateClass(classObject);
  assert.deepEqual(expected, response, 'Wrong serialized response');
});

test('normalizeClasses', function(assert) {
  const serializer = this.subject();
  const classesPayload = {
    "owner": [
      "d8b6eb04-5466-4e29-92f5-06584b6b6ef5",
      "2a0a0d90-faed-4ba4-9bab-04ddc4c18f30"
    ],
    "collaborator": ["63dd64b2-bb30-47a9-8daf-8330f57e16c3"],
    "member": ["e264cdc8-19d1-4285-88f5-5b359daf33da"],
    "member_count": {
      "d8b6eb04-5466-4e29-92f5-06584b6b6ef5": 1
    },
    "classes": [{
      "id": "d8b6eb04-5466-4e29-92f5-06584b6b6ef5",
      "creator_id": "2afaf0fd-ed92-48c5-9195-7f4bc1e0064e",
      "created_at": '2016-01-01',
      "title": "My class - 1",
      "description": "This class is intended to make awareness of good habits",
      "greeting": "Hi! Welcome to my class",
      "grade": [
        4,
        5
      ],
      "class_sharing": "open",
      "cover_image": "e264cdc8-19d1-4285-88f5-5b359daf33da.png",
      "code": "VZFMEWH",
      "min_score": 75,
      "end_date": "2016-12-31",
      "course_id": 'course-id',
      "collaborator": [
        "63dd64b2-bb30-47a9-8daf-8330f57e16c3",
        "E4510f0a-a4a1-46d8-b7c3-fce31754c7d8"
      ],
      "gooru_version": 3,
      "content_visibility": null,
      "is_archived": false
    }, {
      "id": "2a0a0d90-faed-4ba4-9bab-04ddc4c18f30",
      "creator_id": "2afaf0fd-ed92-48c5-9195-7f4bc1e0064e",
      "created_at": '2016-01-01',
      "title": "My class - 2",
      "description": "This class is intended to make awareness of good habits",
      "greeting": "Hi! Welcome to my class",
      "grade": [
        4,
        5
      ],
      "class_sharing": "open",
      "cover_image": "e264cdc8-19d1-4285-88f5-5b359daf33da.png",
      "code": "ALU3LCB",
      "end_date": "2016-12-31",
      "course_id": 'course-id',
      "collaborator": [
        "63dd64b2-bb30-47a9-8daf-8330f57e16c3",
        "E4510f0a-a4a1-46d8-b7c3-fce31754c7d8"
      ],
      "gooru_version": 3,
      "content_visibility": null,
      "is_archived": false
    }]
  };

  const normalizedClasses = serializer.normalizeClasses(classesPayload);
  assert.equal(normalizedClasses.get("ownerList.length"), 2, 'Wrong ownerList');
  assert.equal(normalizedClasses.get("collaboratorList.length"), 1, 'Wrong collaboratorList');
  assert.equal(normalizedClasses.get("memberCount")['d8b6eb04-5466-4e29-92f5-06584b6b6ef5'], 1, 'Wrong memberCount');
  assert.equal(normalizedClasses.get("classes.length"), 2, 'Wrong classes');
  assert.equal(normalizedClasses.get("classes")[0].get('minScore'), 75, 'Wrong min score');
  assert.equal(normalizedClasses.get("classes")[1].get('minScore'), null, 'Wrong min score');
});

test('normalizeReadClassInfo', function(assert) {
  const serializer = this.subject();
  const classPayload = {
    "id": "d44d3928-2623-4925-9d38-e933650a7573",
    "creator_id": "327598a1-109a-4bcc-be9a-357981711381",
    "created_at": '2016-01-01',
    "title": "My Class 1",
    "description": 'Class description',
    "greeting": 'Greeting message',
    "grade": null,
    "class_sharing": "open",
    "cover_image": 'image-name',
    "code": "ABC123",
    "min_score": 0,
    "end_date": "2016-01-01",
    "course_id": "d44d3928-2623-4925-9d38-e933650a7573",
    "collaborator": ['1', '2'],
    "gooru_version": 3,
    "content_visibility": true,
    "is_archived": false
  };

  const normalizedClassInfo = serializer.normalizeReadClassInfo(classPayload);
  assert.equal(normalizedClassInfo.get("id"), "d44d3928-2623-4925-9d38-e933650a7573", 'Wrong id');
  assert.equal(normalizedClassInfo.get("creatorId"), "327598a1-109a-4bcc-be9a-357981711381", 'Wrong creator id');
  assert.equal(normalizedClassInfo.get("owner.id"), "327598a1-109a-4bcc-be9a-357981711381", 'Wrong owner id');
  assert.equal(normalizedClassInfo.get("code"), "ABC123", 'Wrong code');
  assert.equal(normalizedClassInfo.get("title"), "My Class 1", 'Wrong title');
  assert.equal(normalizedClassInfo.get("description"), "Class description", 'Wrong description');
  assert.equal(normalizedClassInfo.get("courseId"), "d44d3928-2623-4925-9d38-e933650a7573", 'Wrong course id');
  assert.equal(normalizedClassInfo.get("greeting"), "Greeting message", 'Wrong greeting');
  assert.equal(normalizedClassInfo.get("grade.length"), 0, 'Wrong grade length');
  assert.equal(normalizedClassInfo.get("classSharing"), "open", 'Wrong classSharing');
  assert.equal(normalizedClassInfo.get("coverImage"), "image-name", 'Wrong coverImage');
  assert.equal(normalizedClassInfo.get("minScore"), null, 'Wrong minScore');
  assert.equal(normalizedClassInfo.get("startDate"), '2016-01-01', 'Wrong startDate');
  assert.equal(normalizedClassInfo.get("endDate"), '2016-01-01', 'Wrong endDate');
  assert.equal(normalizedClassInfo.get("creatorSystem"), '', 'Wrong creator system');
  assert.equal(normalizedClassInfo.get("contentVisibility"), true, 'Wrong creator contentVisibility');
  assert.equal(normalizedClassInfo.get("isArchived"), false, 'Wrong creator is archived');
  assert.equal(normalizedClassInfo.get("collaborators.length"), 2, 'Wrong collaborators');
  assert.equal(normalizedClassInfo.get("collaborators")[0].get("id"), '1', 'Wrong collaborator id');

});

test('normalizeReadClassMembers', function(assert) {
  const serializer = this.subject();
  const classPayload = {
    "owner": ["08fd3a1a-8118-4b02-ab59-c0b4a5037863"],
    "collaborator": [],
    "member": ["e568193d-603a-4c3a-a5d2-320579d32f3f"],
    "invitees": [],
    "details": [{
      "id": "08fd3a1a-8118-4b02-ab59-c0b4a5037863",
      "firstname": "Jeffrey",
      "lastname": "Bermudez",
      "thumbnail_path": null
    }, {
      "id": "e568193d-603a-4c3a-a5d2-320579d32f3f",
      "firstname": "Jeffrey",
      "lastname": "Bermudez",
      "thumbnail_path": null
    }]
  };
  const normalizedClassMembers = serializer.normalizeReadClassMembers(classPayload);
  assert.equal(normalizedClassMembers.get("owner.id"), '08fd3a1a-8118-4b02-ab59-c0b4a5037863', 'Wrong owner id');
  assert.equal(normalizedClassMembers.get("collaborators").length, 0, 'Wrong collaborators');
  assert.equal(normalizedClassMembers.get("members").length, 1, 'Wrong members');
  assert.equal(normalizedClassMembers.get("members")[0].get("id"), 'e568193d-603a-4c3a-a5d2-320579d32f3f', 'Wrong members');
});
