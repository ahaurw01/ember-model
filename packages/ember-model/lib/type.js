Ember.Type = Ember.Object.extend({
  /**
   * Given two values of this type, determine if these are equal.
   * @param value1
   * @param value2
   */
  isEqual: function(value1, value2) {
    throw new Error('Ember.Type subclasses must implement isEqual');
  },

  /**
   * Given a string, attempt to convert to the proper data type
   * @param {String} value
   */
  deserialize: function(value) {
    throw new Error('Ember.Type subclasses must implement deserialize');
  },

  /**
   * Convert from the data type into an externally consumable form
   * @param value
   */
  serialize: function(value) {
    throw new Error('Ember.Type subclasses must implement serialize');
  },

  /**
   * Simulate a has-many relationship
   */
  array: (function() {
    var parentType = this,
        Type;
    Type = Ember.Type.extend({
      isEqual: function(value1, value2) {
        if (!(value1 instanceof Array) || !(value2 instanceof Array) || value1.length !== value2.length) {
          return false;
        }
        for (var i = 0; i < value1.length; i++) {
          if (!parentType.isEqual(value1[i], value2[i])) {
            return false;
          }
        }
        return true;
      },

      deserialize: function(value) {
        var array;
        Ember.assert('Cannot deserialize non-array object', value instanceof Array);
        array = Ember.A(value).map(function(val) {
          return parentType.deserialize(val);
        });
        return array;
      },

      serialize: function(value) {
        var stringRepresentation = '[';
        for (var i = 0; i < value.length; i++) {
          stringRepresentation += parentType.serialize(value[i]);
          if (i < i - 1) {
            stringRepresentation += ',';
          }
        }
        stringRepresentation += ']';
        return stringRepresentation;
      }
    });
    return Type;
  })()
});
Ember.Type.reopenClass({
  /*
  Concrete implementations
   */

  number: Ember.Type.create({
    isEqual: function(value1, value2) {
      return typeof value1 === 'number' && value1 === value2;
    },

    deserialize: function(value) {
      return +value;
    },

    serialize: function(value) {
      return '' + value;
    }
  }),

  string: Ember.Type.create({
    isEqual: function(value1, value2) {
      return typeof value1 === 'string' && value1 === value2;
    },

    deserialize: function(value) {
      return value.toString();
    },

    serialize: function(value) {
      return value.toString();
    }
  }),

  boolean: Ember.Type.create({
    isEqual: function(value1, value2) {
      return typeof value1 === 'boolean' && value1 === value2;
    },

    deserialize: function(value) {
      switch (typeof value) {
        case 'boolean':
          return value;
        case 'string':
          return value === 'true';
        default:
          return !!value;
      }
    },

    serialize: function(value) {
      return value.toString();
    }
  }),

  date: Ember.Type.create({
    isEqual: function(value1, value2) {
      return value1 instanceof Date && value2 instanceof Date && value1.getTime() === value2.getTime;
    },

    deserialize: function(value) {
      if (value instanceof Date) {
        return value;
      }
      if (typeof value === 'number' || typeof value === 'string') {
        return new Date(value);
      }
      return null;
    },

    serialize: function(value) {
      return value.toString();
    }
  })
});