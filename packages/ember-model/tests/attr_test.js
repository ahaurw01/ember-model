var attr = Ember.attr,
    Parent,
    Child;

module("Ember.attr", {
  setup: function() {
    Child = Ember.Model.extend({
      name: Ember.attr(Ember.Type.string),
      age: Ember.attr(Ember.Type.number),
      isCool: Ember.attr(Ember.Type.boolean)
    });
    Parent = Ember.Model.extend({
      name: Ember.attr(Ember.Type.string),
      age: Ember.attr(Ember.Type.number),
      children: Ember.attr(Child.array)
    });
  }
});

test("when the attr is specified on an object it should Object.create the object", function() {
  var Page = Ember.Model.extend({
    author: attr()
  });
  var originalAuthorObject = {id: 1, name: "Erik"},
      page = Page.create();

  Ember.run(function() {
    page.load(1, {author: originalAuthorObject});
  });

  var newAuthorObject = page.get('author');
  ok(newAuthorObject !== originalAuthorObject, "The objects shouldn't be the same");
});

test("types work!", function () {
  expect(10);

  var childObjects = [
      {id: 1, name: 'Erik', age: 6, isCool: true},
      {id: 2, name: 'Aaron', age: 5, isCool: false}
    ],
    parentObject = {id: 1, name: 'Daddy', age: 35, children: childObjects},
    parent = Parent.create();

  Ember.run(function() {
    parent.load(1, parentObject);
  });

  equal(parent.get('name'), 'Daddy');
  equal(typeof parent.get('name'), 'string');
  equal(parent.get('age'), 35);
  equal(typeof parent.get('age'), 'number');
  equal(parent.get('children').length, 2);
  equal(parent.get('children')[0].get('name'), 'Erik');
  equal(typeof parent.get('children')[0].get('name'), 'string');
  equal(parent.get('children')[0].get('age'), 6);
  equal(typeof parent.get('children')[0].get('age'), 'number');
  equal(parent.get('children')[0].get('isCool'), true);
});