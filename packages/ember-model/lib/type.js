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
  }
});
Ember.Type.reopenClass({
  /*
  Concrete implementations
   */

  /**
   * Basic type: assumes nothing about the value.
   */
  basic: Ember.Type.create({
    isEqual: function(value1, value2) {
      return value1 === value2;
    },

    deserialize: function(value) {
      return value;
    },

    serialize: function(value) {
      return value;
    }
  }),

  /**
   * Number type: serialize
   */
  number: Ember.Type.create({
    isEqual: function(value1, value2) {
      return typeof value1 === 'number' && value1 === value2;
    },

    deserialize: function(value) {
      return +value;
    },

    serialize: function(value) {
      return value;
    }
  }),

  /**
   * String type: toString() ALL the things!
   */
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

  /**
   * Boolean type: deserialize a string to a boolean or inspect the truthi/falsiness
   */
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
      return value;
    }
  }),

  /**
   * Date type:
   * Deserialize a timestamp or a string representation.
   * Serialize as unix time.
   */
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
      return value.getTime();
    }
  }),

  /**
   * Object type: wrap with Ember.Object.create()
   */
  object: Ember.Type.create({
    isEqual: function(value1, value2) {
      return value1 === value2;
    },

    deserialize: function(value) {
      return Ember.Object.create(value);
    },

    serialize: function(value) {
      // TODO is this ok?
      return value;
    }
  }),

  /**
   * Array type: Wrap a given subType as an array.
   */
  Array: Ember.Type.extend({
    subType: Ember.Type.create(),

    isEqual: function(value1, value2) {
      if (!(value1 instanceof Array) || !(value2 instanceof Array) || value1.length !== value2.length) {
        return false;
      }
      for (var i = 0; i < value1.length; i++) {
        if (!this.subType.isEqual(value1[i], value2[i])) {
          return false;
        }
      }
      return true;
    },

    deserialize: function(value) {
      var array;
      Ember.assert('Cannot deserialize non-array object', value instanceof Array);
      return value.map(function(val) {
        return this.subType.deserialize(val);
      }, this);
    },

    serialize: function(value) {
      Ember.assert('Cannot serialize non-array object', value instanceof Array);
      return value.map(function(val) {
        return this.subType.serialize(val);
      }, this);
    }
  }),

  /**
   * Convenience class method for creating an array type.
   * @param type {Ember.Type|Ember.Model} type instance or Model class
   * @returns {Ember.Type} Array type instance
   */
  arrayOf: function(type) {
    if (!type) {
      type = Ember.Type.basic;
    } else if (type.isClass) {
      type = type.type();
    }
    Ember.assert('Must provide a type instance to arrayOf()', type instanceof Ember.Type);
    return Ember.Type.Array.create({subType: type});
  }
});