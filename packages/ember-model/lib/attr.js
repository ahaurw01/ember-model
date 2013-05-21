var get = Ember.get,
    set = Ember.set,
    meta = Ember.meta;

Ember.attr = function(type) {
  if (!type) {
    type = Ember.Type.basic;
  } else if (type.isClass && type.type) {
    // Get the type of the model if we are given a model class
    type = type.type();
  }
  Ember.assert('Must provide a type to Ember.attr()', type instanceof Ember.Type);
  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        dataValue = data && type.deserialize(get(data, key)),
        beingCreated = meta(this).proto === this;

    if (arguments.length === 2) {
      if (beingCreated) {
        if (!data) {
          data = {};
          set(this, 'data', data);
          data[key] = type.serialize(value);
        }
        return value;
      }

      var isEqual = type.isEqual(dataValue, value);
      if (!isEqual) {
        if (!this._dirtyAttributes) { this._dirtyAttributes = Ember.A(); }
        this._dirtyAttributes.push(key);
      } else {
        if (this._dirtyAttributes) { this._dirtyAttributes.removeObject(key); }
      }
      return value;
    }

    return dataValue;
  }).property('data').meta({isAttribute: true, type: type});
};