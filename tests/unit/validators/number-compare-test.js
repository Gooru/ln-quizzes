import { moduleFor, test } from 'ember-qunit';
import Context from 'quizzes/models/context/context';

moduleFor('validator:number-compare', 'Unit | Validator | number-compare', {
  needs: ['validator:messages']
});
test('Valid Compare Numbers', function(assert) {
  assert.expect(1);

  let validator =  this.subject();

  var model =  Context.create(Ember.getOwner(this).ownerInjection(),{
    property:10
  });

  assert.ok(validator.validate(100,{property:'property'},model),'The value should be greater than the property');

});
test('Invalid Compare Numbers', function(assert) {
  assert.expect(1);

  let validator =  this.subject();
  let message = 'is not true';

  validator.set('i18n', Ember.Object.create({
    t: function () {
      return { string: message };
    }
  }));

  var model =  Context.create(Ember.getOwner(this).ownerInjection(),{
    property:200
  });

  assert.equal(validator.validate(100,{property:'property'},model),message,'The value should be less than the property');

});
