import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';


moduleForComponent('player/resources/gru-youtube-resource', 'Integration | Component | player/resources/gru youtube resource', {
  integration: true
});

test('Youtube player layout', function (assert) {

  assert.expect(2);

  const resource = Ember.Object.create(
    {
      "id": 10,
      "order": 2,
      "resourceType": "video/youtube",
      "resourceFormat": "video",
      "displayGuide": {
        "start_time": "00:03:10",
        "end_time": "00:03:20"
      },
      "url": "https://www.youtube.com/watch?v=aBSH3IoFZsc"
    });

  this.set('resource', resource);
  this.render(hbs`{{player/resources/gru-youtube-resource resource=resource}}`);

  var $component = this.$(); //component dom element

  T.exists(assert, $component.find(".gru-youtube-resource iframe"), "Missing youtube element");
  assert.equal($component.find("iframe").attr("src"), "https://www.youtube.com/embed/aBSH3IoFZsc?start=190&end=200&rel=0", "Wrong url");
});

