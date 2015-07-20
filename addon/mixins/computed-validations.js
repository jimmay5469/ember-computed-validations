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
      var _this = this;
      return Ember.Object.create({
        unknownProperty: function(property) {
          if(!_this.computedValidations[property]) {
            return [];
          }
          var validationsForProperty = Object.keys(_this.computedValidations[property]);
          return validationsForProperty.reduce(function(errorsForProperty, validationForProperty) {
            if (!_this.get(validationForProperty)) {
              errorsForProperty.push(_this.computedValidations[property][validationForProperty]);
            }
            return errorsForProperty;
          }, []);
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
