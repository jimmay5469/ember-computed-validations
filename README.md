# ember-computed-validations [![Build Status](https://travis-ci.org/jimmay5469/ember-computed-validations.svg?branch=master)](https://travis-ci.org/jimmay5469/ember-computed-validations) [![Ember Observer Score](http://emberobserver.com/badges/ember-computed-validations.svg)](http://emberobserver.com/addons/ember-computed-validations)

Lightweight validations library for [ember.js](http://emberjs.com/) focused on computed properties.

One of the most useful features in ember is computed properties. These can be particularly useful to determine the validity of a property without having to learn a new validations DSL. This library makes it easy to use them for validations by aggregating error messages for each property and by providing a mechanism to easily determine overall validity. In addition it gives you a place to easily specify error messages for each "validation" (computed property used for validation).

Because this library uses computed properties under the hood instead of observers or any other means, you can say goodbye to the days of calling `validate()` or any other hacks to get your validation back in sync.

## Using ember-computed-validations

```
ember install ember-computed-validations
```

Example:
```
import ComputedValidationsMixin from 'ember-computed-validations/mixins/computed-validations';

export default Ember.Component.extend(ComputedValidationsMixin, {
  user: null,

  // validations
  firstNameNotEmpty: Ember.computed.notEmpty('user.firstName'),
  emailIsEmail: Ember.computed.match('user.email', /^.+@.+\..+$/),
  passwordsMatch: Ember.computed('user.password1', 'user.password2', function() {
    return this.get('user.password1') === this.get('user.password2');
  }),

  // declaring which validations validate which properties and their respective error messages
  computedValidations: {
    // properties to validate
    firstName: {
      // validations with error message to display if the validation is falsy
      firstNameNotEmpty: 'First name is a required field.'
    },
    lastName: {
      // validations do not need to be computed properties
      'user.lastName': 'Last name is a required field.'
    },
    email: {
      emailIsEmail: 'Please enter a valid email address.'
    },
    password: {
      // you can list multiple validations
      'user.password1': 'Please enter a password.',
      passwordsMatch: 'The password fields must match.'
    }
  }
});
```

You can use this mixin on any type of ember object: `Ember.Component`, `DS.Model`, `Ember.Object`, etc. It will add properties to your object so you can determine the state of validations easily:
```
component.get('computedErrors.firstName'); // ['First name is a required field.']
component.get('computedIsValid'); // false
component.get('computedIsInvalid'); // true
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
