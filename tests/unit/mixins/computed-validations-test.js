import Ember from 'ember';
import ComputedValidationsMixin from 'ember-computed-validations/mixins/computed-validations';
import { module, test } from 'qunit';

module('Unit | Mixin | computed validations');

// Replace this with your real tests.
test('it works', function(assert) {
  var ComputedValidationsObject = Ember.Object.extend(ComputedValidationsMixin);
  var subject = ComputedValidationsObject.create();
  assert.ok(subject);
});
