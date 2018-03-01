/// <reference path="hawtio-core-navigation.ts"/>

describe("Nav Registry Tests", function() {

  it("Should create a new nav item in the registry", function() {
    var registry = Nav.createRegistry(document.createElement('UL'));
    var navItem = registry.builder().id("foo").build();
    registry.add(navItem);
    registry.iterate(function(item)  {
      expect(item.id).toBe("foo");
    });
  });

  it("Should call on a notification handler when an item is added", function() {
    var registry = Nav.createRegistry(document.createElement('UL'));
    var navItem = registry.builder().id("foo").build();
    var added = 0;
    registry.on(Nav.Actions.ADD, 'test', function(item) {
      added = added + 1;
    });
    registry.add(navItem);
    expect(added).toBe(1);
  });

  it("Should call on a notification handler even after an item is already added", function() {
    var registry = Nav.createRegistry(document.createElement('UL'));
    var navItem = registry.builder().id("foo").build();
    registry.add(navItem);
    var added = 0;
    registry.on(Nav.Actions.ADD, 'test', function(item) {
      added = added + 1;
    });
    expect(added).toBe(1);
  });

  it("Should call on a notification handler when an item is removed", function() {
    var registry = Nav.createRegistry(document.createElement('UL'));
    var navItem = registry.builder().id("foo").build();
    var added = 0;
    registry.on(Nav.Actions.ADD, 'test', function(item)  {
      added = added + 1;
    });
    registry.on(Nav.Actions.REMOVE, 'test', function(item)  {
      added = added - 1;
    });
    registry.add(navItem);
    registry.remove(function(item) { return item.id === "foo"; });
    expect(added).toBe(0);
  });

});
