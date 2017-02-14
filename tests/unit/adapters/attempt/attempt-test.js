import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:attempt/attempt', 'Unit | Adapter | attempt/attempt', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('getReportData', function(assert) {
  const adapter = this.subject();
  const expectedContextId = 'context-id';
  const routes = function() {
    this.get('/quizzes/api/v1/attempts/contexts/context-id', function() {
      return [200, {'Content-Type': 'application/json'}, JSON.stringify({})];
    }, false);
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) => assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter.getReportData(expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});
