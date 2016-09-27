import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  normalizeFindRecordResponse: function(store, primaryModelClass, payload) {
    var model = {
      data: {},
      included: []
    };
    var serializer = this;
    var courseItem = {
      id: payload.gooruOid,
      type: "course/course",
      attributes: this.normalizeCourseAttributes(payload),
      relationships: {
        remixedBy: { data: [] }
      }
    };
    serializer.normalizeRemixes(Ember.A([payload.user]), courseItem, model);
    model.data = courseItem;
    return model;
  },

  normalizeCourseAttributes: function(payload) {
    return {
      title: payload.title,
      subjects: this.normalizeSubjects(payload.taxonomyCourse),
      // This property is not provided by back-end
      imageUrl: (payload.imageUrl ? payload.imageUrl : '/assets/gooru/profile.png'),
      totalUnits: (payload.summary && payload.summary.unitCount ? payload.summary.unitCount : 0),
      isPublic: (payload.sharing === 'public')
    };
  },

  normalizeSubjects: function(taxonomy) {
    var subjects = [];
    if (taxonomy && taxonomy.length > 0) {
      Ember.$.each(taxonomy, function(index, item) {
        subjects.push(item.name);
      });
    }
    return subjects;
  },

  normalizeRemixes: function(users, courseItem, model) {
    Ember.$.each(users, function(index, user) {
      courseItem.relationships.remixedBy.data.push({
        id: user.gooruUId,
        type: 'user/user'
      });
      model.included.push({
        id: user.gooruUId,
        type: 'user/user',
        attributes: {
          username: user.username,
          profileImageUrl: (user.profileImageUrl ? user.profileImageUrl : '/assets/gooru/profile.png')
        }
      });
    });
  }

});


