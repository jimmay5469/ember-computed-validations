import Ember from 'ember';

export default Ember.Mixin.create({
  initEmberComputedValidations: Ember.on('init', function() {
    if(!this.computedValidations) {
      return;
    }

    var validations = Ember.A();

    var properties = Object.keys(this.computedValidations);
    for (var i=0; i<properties.length; i++) {
      var property = properties[i];
      var validationsForProperty = Object.keys(this.computedValidations[property]);
      validations.pushObjects(validationsForProperty);
    }

    Ember.defineProperty(this, 'computedErrors', Ember.computed(...validations, function() {
      return Ember.Object.create({
        unknownProperty: (property)=> {
          if(!this.computedValidations[property]) {
            return Ember.A();
          }
          var validationsForProperty = Object.keys(this.computedValidations[property]);
          return validationsForProperty.reduce((errorsForProperty, validationForProperty)=> {
            if (!this.get(validationForProperty)) {
              errorsForProperty.push(this.computedValidations[property][validationForProperty]);
            }
            return errorsForProperty;
          }, Ember.A());
        }
      });
    }));

    Ember.defineProperty(this, 'computedIsValid', Ember.computed(...validations, function() {
      return validations.every((validation)=> {
        return this.get(validation);
      });
    }));

    Ember.defineProperty(this, 'computedIsInvalid', Ember.computed.not('computedIsValid'));
  })
});
