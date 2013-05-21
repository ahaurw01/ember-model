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
      children: Ember.attr(Ember.Type.arrayOf(Child))
    });
  }
});

test("when the attr is specified on an object it should Object.create the object", function() {
  var Page = Ember.Model.extend({
    author: attr(Ember.Type.object)
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
        {id: '1', name: 'Erik', age: '6', isCool: 'true'},
        {id: '2', name: 'Aaron', age: '5', isCool: 'false'}
      ],
      parentObject = {id: '1', name: 'Daddy', age: '35', children: childObjects},
      parent = Parent.create(),
      parentAge,
      parentName,
      children,
      childAge,
      childName,
      childIsCool;

  Ember.run(function() {
    parent.load(1, parentObject);
    parentAge = parent.get('age');
    parentName = parent.get('name');
    children = parent.get('children');
    childAge = children[0].get('age');
    childName = children[0].get('name');
    childIsCool = children[0].get('isCool');
  });

  equal(parentName, 'Daddy');
  equal(typeof parentName, 'string');
  equal(parentAge, 35);
  equal(typeof parent.get('age'), 'number');
  equal(children.length, 2);
  equal(childName, 'Erik');
  equal(typeof childName, 'string');
  equal(childAge, 6);
  equal(typeof childAge, 'number');
  equal(childIsCool, true);
});