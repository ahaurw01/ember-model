var get = Ember.get,
    set = Ember.set,
    meta = Ember.meta;

Ember.attr = function(Type) {
  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        dataValue = data && (Type ? Type.deserialize(get(data, key)) : get(data, key)),
        beingCreated = meta(this).proto === this;

    if (arguments.length === 2) {
      if (beingCreated) {
        if (!data) {
          data = {};
          set(this, 'data', data);
          data[key] = Type ? Type.serialize(value) : value;
        }
        return value;
      }

      var isEqual;
      if (Type && Type.isEqual) {
        isEqual = Type.isEqual(dataValue, value);
      } else {
        isEqual = dataValue === value;
      }

      if (!isEqual) {
        if (!this._dirtyAttributes) { this._dirtyAttributes = Ember.A(); }
        this._dirtyAttributes.push(key);
      } else {
        if (this._dirtyAttributes) { this._dirtyAttributes.removeObject(key); }
      }
      return value;
    }

    if (typeof dataValue === 'object' && !(dataValue instanceof Ember.Object)) {
      dataValue = Ember.create(dataValue);
    }
    return dataValue;
  }).property('data').meta({isAttribute: true, type: Type});
};