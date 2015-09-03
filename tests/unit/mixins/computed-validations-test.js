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

test('it can validate with a computed property', function(assert) {
  var ComputedValidationsObject = Ember.Object.extend(ComputedValidationsMixin, {
    firstName: null,
    firstNameNotEmpty: Ember.computed.notEmpty('firstName'),
    computedValidations: {
      firstName: {
        firstNameNotEmpty: 'First name is a required field.'
      }
    }
  });
  var subject = ComputedValidationsObject.create();
  assert.equal(subject.get('computedIsValid'), false);
  assert.equal(subject.get('computedIsInvalid'), true);
  assert.deepEqual(subject.get('computedErrors.firstName'), ['First name is a required field.']);

  subject.set('firstName', 'Bob');

  assert.equal(subject.get('computedIsValid'), true);
  assert.equal(subject.get('computedIsInvalid'), false);
  assert.deepEqual(subject.get('computedErrors.firstName'), []);
});

test('it can validate without a computed property', function(assert) {
  var ComputedValidationsObject = Ember.Object.extend(ComputedValidationsMixin, {
    firstName: null,
    computedValidations: {
      firstName: {
        firstName: 'First name is a required field.'
      }
    }
  });
  var subject = ComputedValidationsObject.create();
  assert.equal(subject.get('computedIsValid'), false);
  assert.equal(subject.get('computedIsInvalid'), true);
  assert.deepEqual(subject.get('computedErrors.firstName'), ['First name is a required field.']);

  subject.set('firstName', 'Bob');

  assert.equal(subject.get('computedIsValid'), true);
  assert.equal(subject.get('computedIsInvalid'), false);
  assert.deepEqual(subject.get('computedErrors.firstName'), []);
});

test('it can validate a nested property', function(assert) {
  var ComputedValidationsObject = Ember.Object.extend(ComputedValidationsMixin, {
    user: null,
    computedValidations: {
      firstName: {
        'user.firstName': 'First name is a required field.'
      }
    }
  });
  var subject = ComputedValidationsObject.create();
  assert.equal(subject.get('computedIsValid'), false);
  assert.equal(subject.get('computedIsInvalid'), true);
  assert.deepEqual(subject.get('computedErrors.firstName'), ['First name is a required field.']);

  subject.set('user', {firstName:'Bob'});

  assert.equal(subject.get('computedIsValid'), true);
  assert.equal(subject.get('computedIsInvalid'), false);
  assert.deepEqual(subject.get('computedErrors.firstName'), []);
});

test('it can validate a property with multiple validations', function(assert) {
  var ComputedValidationsObject = Ember.Object.extend(ComputedValidationsMixin, {
    user: null,
    passwordsMatch: Ember.computed('user.password1', 'user.password2', function() {
      return this.get('user.password1') === this.get('user.password2');
    }),
    computedValidations: {
      password: {
        'user.password1': 'Please enter a password.',
        passwordsMatch: 'The password fields must match.'
      }
    }
  });
  var subject = ComputedValidationsObject.create();
  assert.equal(subject.get('computedIsValid'), false);
  assert.equal(subject.get('computedIsInvalid'), true);
  assert.deepEqual(subject.get('computedErrors.password'), ['Please enter a password.']);

  subject.set('user', {password1: 'p@ssw0rd!'});

  assert.equal(subject.get('computedIsValid'), false);
  assert.equal(subject.get('computedIsInvalid'), true);
  assert.deepEqual(subject.get('computedErrors.password'), ['The password fields must match.']);

  subject.set('user.password2', 'p@ssw0rd!');

  assert.equal(subject.get('computedIsValid'), true);
  assert.equal(subject.get('computedIsInvalid'), false);
  assert.deepEqual(subject.get('computedErrors.password'), []);

  subject.set('user.password1', null);

  assert.equal(subject.get('computedIsValid'), false);
  assert.equal(subject.get('computedIsInvalid'), true);
  assert.deepEqual(subject.get('computedErrors.password'), ['Please enter a password.', 'The password fields must match.']);
});

test('it can get an error message from a function return value', function(assert) {
  var ComputedValidationsObject = Ember.Object.extend(ComputedValidationsMixin, {
    firstName: 'Bob',
    firstNameNotTooLong: Ember.computed.gte('firstName.length', 5),
    computedValidations: {
      firstName: {
        firstNameNotTooLong: function() {
          return `A first name of '${this.get('firstName')}' is too long.`;
        }
      }
    }
  });
  var subject = ComputedValidationsObject.create();
  assert.deepEqual(subject.get('computedErrors.firstName'), ["A first name of 'Bob' is too long."]);

  subject.set('firstName', 'Joe');
  assert.deepEqual(subject.get('computedErrors.firstName'), ["A first name of 'Joe' is too long."]);

  subject.set('firstName', 'Joseph');
  assert.deepEqual(subject.get('computedErrors.firstName'), []);
});
