Ember.Type = Em.Object.extend({
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