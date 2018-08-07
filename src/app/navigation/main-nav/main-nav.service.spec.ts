/// <reference path="main-nav-item.ts"/>
/// <reference path="main-nav.service.ts"/>

describe("MainNavService", function () {

  let mainNavService: Nav.MainNavService;
  let $location;
  let $templateCache;

  beforeEach(function() {
    $location = jasmine.createSpyObj('$location', ['path']);
    $templateCache = jasmine.createSpyObj('$templateCache', ['put']);
    mainNavService = new Nav.MainNavService($location, $templateCache);
  });

  describe("constructor", function () {

    it("should add default template to cache", function () {
      expect($templateCache.put).toHaveBeenCalledWith(Nav.DEFAULT_TEMPLATE_URL, Nav.DEFAULT_TEMPLATE);
    });

  });

  describe("addItem", function () {

    it("should add item to array and template to cache", function () {
      // given
      const props: Nav.MainNavItemProps = {title: 'My Title'};
      // when
      mainNavService.addItem(props);
      // then
      const items = mainNavService.getValidItems();
      expect(items.length).toBe(1);
      const item = items[0];
      expect(item.title).toBe('My Title');
      expect($templateCache.put).toHaveBeenCalledWith(item.templateUrl, item.template);
    });

  });

  describe("getValidItems", function () {

    it("should return valid items sorted by rank and title", function () {
      // given
      const props7: Nav.MainNavItemProps = {title: 'Item 7', isValid: () => false};
      const props6: Nav.MainNavItemProps = {title: 'Item 6', rank: 1};
      const props5: Nav.MainNavItemProps = {title: 'Item 5'};
      const props4: Nav.MainNavItemProps = {title: 'Item 4', rank: -1};
      const props3: Nav.MainNavItemProps = {title: 'Item 3', rank: 1};
      const props2: Nav.MainNavItemProps = {title: 'Item 2'};
      const props1: Nav.MainNavItemProps = {title: 'Item 1', rank: -1};
      // when
      mainNavService.addItem(props6);
      mainNavService.addItem(props5);
      mainNavService.addItem(props4);
      mainNavService.addItem(props3);
      mainNavService.addItem(props2);
      mainNavService.addItem(props1);
      // then
      const items = mainNavService.getValidItems();
      expect(items.length).toBe(6);
      expect(items[0].title).toBe('Item 3');
      expect(items[1].title).toBe('Item 6');
      expect(items[2].title).toBe('Item 2');
      expect(items[3].title).toBe('Item 5');
      expect(items[4].title).toBe('Item 1');
      expect(items[5].title).toBe('Item 4');
    });

  });

  describe("getActiveItem", function () {

    it("should return undefined when there is no active item", function () {
      // given
      mainNavService.addItem({title: 'Item 1'});
      mainNavService.addItem({title: 'Item 2'});
      // when
      const activeItem = mainNavService.getActiveItem();
      // then
      expect(activeItem).toBeUndefined();
    });

    it("should return active item when there is one", function () {
      // given
      mainNavService.addItem({title: 'Item 1'});
      mainNavService.addItem({title: 'Item 2'});
      const items = mainNavService.getValidItems();
      mainNavService.activateItem(items[1]);
      // when
      const activeItem = mainNavService.getActiveItem();
      // then
      expect(activeItem.title).toBe('Item 2');
    });

  });

  describe("activateItem", function () {

    it("should activate item", function () {
      // given
      mainNavService.addItem({title: 'Item 1'});
      mainNavService.addItem({title: 'Item 2'});
      const items = mainNavService.getValidItems();
      mainNavService.activateItem(items[0]);
      // when
      mainNavService.activateItem(items[1]);
      // then
      const activeItem = mainNavService.getActiveItem();
      expect(activeItem.title).toBe('Item 2');
    });

  });

  describe("clearActiveItem", function () {

    it("should clear activate item", function () {
      // given
      mainNavService.addItem({title: 'Item 1'});
      mainNavService.addItem({title: 'Item 2'});
      const items = mainNavService.getValidItems();
      mainNavService.activateItem(items[0]);
      // when
      mainNavService.clearActiveItem();
      // then
      const activeItem = mainNavService.getActiveItem();
      expect(activeItem).toBeUndefined();
    });

  });

  describe("changeRouteIfRequired", function () {

    it("should not change route when 'href' property is undefined", function () {
      // given
      mainNavService.addItem({title: 'Item 1'});
      const items = mainNavService.getValidItems();
      mainNavService.activateItem(items[0]);
      // when
      mainNavService.changeRouteIfRequired();
      // then
      expect($location.path).toHaveBeenCalledTimes(0);
    });

    it("should change route when 'href' property is defined", function () {
      // given
      mainNavService.addItem({title: 'Item 1', href: '/path'});
      const items = mainNavService.getValidItems();
      mainNavService.activateItem(items[0]);
      // when
      mainNavService.changeRouteIfRequired();
      // then
      expect($location.path).toHaveBeenCalledWith('/path');
    });

  });

  describe("findItemByPath", function () {
    
    it("should return undefined when item is not found", function () {
      // given
      const props1: Nav.MainNavItemProps = {title: 'Item 1', href: '/path1'};
      const props2: Nav.MainNavItemProps = {title: 'Item 2', basePath: '/path2'};
      $location.path.and.returnValue('/path3/blah');
      // when
      mainNavService.addItem(props1);
      mainNavService.addItem(props2);
      // then
      const item = mainNavService.findItemByPath();
      expect(item).toBeUndefined();
    });

    it("should find item with href or basePath that is a prefix of the current location path", function () {
      // given
      const props1: Nav.MainNavItemProps = {title: 'Item 1', href: '/path1'};
      const props2: Nav.MainNavItemProps = {title: 'Item 2', basePath: '/path2'};
      $location.path.and.returnValue('/path2/blah');
      // when
      mainNavService.addItem(props1);
      mainNavService.addItem(props2);
      // then
      const item = mainNavService.findItemByPath();
      expect(item.title).toBe('Item 2');
    });

  });

});
