/// <reference path="main-nav-item.ts"/>
/// <reference path="main-nav.service.ts"/>

describe("MainNavService", function () {

  let mainNavService: Nav.MainNavService;
  let $location;
  let $templateCache;
  let configManager;

  beforeEach(function () {
    $location = jasmine.createSpyObj('$location', ['path']);
    $templateCache = jasmine.createSpyObj('$templateCache', ['put']);
    configManager = jasmine.createSpyObj('configManager', ['isRouteEnabled']);
    configManager.isRouteEnabled.and.returnValue(true);
    mainNavService = new Nav.MainNavService($location, $templateCache, configManager);
  });

  describe("constructor", function () {

    it("should add default template to cache", function () {
      expect($templateCache.put).toHaveBeenCalledWith(Nav.DEFAULT_TEMPLATE_URL, Nav.DEFAULT_TEMPLATE);
    });

  });

  describe("addItem", function () {

    it("should add item to array and template to cache when item's route is enabled", function () {
      // given
      configManager.isRouteEnabled.and.returnValue(true);
      // when
      mainNavService.addItem({ title: 'Item1', href: '/path1' });
      // then
      const items = mainNavService.getValidItems();
      expect(items.length).toBe(1);
      const item = items[0];
      expect(item.title).toBe('Item1');
      expect($templateCache.put).toHaveBeenCalledWith(item.templateUrl, item.template);
    });

    it("should not add item to array and template to cache when item's route is disabled", function () {
      // given
      configManager.isRouteEnabled.and.returnValue(false);
      // when
      mainNavService.addItem({ title: 'Item1', href: '/path1' });
      // then
      const items = mainNavService.getValidItems();
      expect(items.length).toBe(0);
    });

  });

  describe("getValidItems", function () {

    it("should return valid items sorted by rank and title", function () {
      // given
      mainNavService.addItem({ title: 'Item 7', basePath: '/path7', isValid: () => false });
      mainNavService.addItem({ title: 'Item 6', basePath: '/path6', rank: 1 });
      mainNavService.addItem({ title: 'Item 5', basePath: '/path5' });
      mainNavService.addItem({ title: 'Item 4', basePath: '/path4', rank: -1 });
      mainNavService.addItem({ title: 'Item 3', basePath: '/path3', rank: 1 });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
      mainNavService.addItem({ title: 'Item 1', basePath: '/path1', rank: -1 });
      // when
      const items = mainNavService.getValidItems();
      // then
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
      mainNavService.addItem({ title: 'Item 1', basePath: '/path1' });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
      // when
      const activeItem = mainNavService.getActiveItem();
      // then
      expect(activeItem).toBeUndefined();
    });

    it("should return active item when there is one", function () {
      // given
      mainNavService.addItem({ title: 'Item 1', basePath: '/path1' });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
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
      mainNavService.addItem({ title: 'Item 1', basePath: '/path1' });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
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
      mainNavService.addItem({ title: 'Item 1', basePath: '/path1' });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
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
      mainNavService.addItem({ title: 'Item 1', basePath: '/path1' });
      const items = mainNavService.getValidItems();
      mainNavService.activateItem(items[0]);
      // when
      mainNavService.changeRouteIfRequired();
      // then
      expect($location.path).toHaveBeenCalledTimes(0);
    });

    it("should change route when 'href' property is defined", function () {
      // given
      mainNavService.addItem({ title: 'Item 1', href: '/path' });
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
      mainNavService.addItem({ title: 'Item 1', href: '/path1' });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
      $location.path.and.returnValue('/path3/blah');
      // when
      const item = mainNavService.findItemByPath();
      // then
      expect(item).toBeUndefined();
    });

    it("should find item with href or basePath that is a prefix of the current location path", function () {
      // given
      mainNavService.addItem({ title: 'Item 1', href: '/path1' });
      mainNavService.addItem({ title: 'Item 2', basePath: '/path2' });
      $location.path.and.returnValue('/path2/blah');
      // when
      const item = mainNavService.findItemByPath();
      // then
      expect(item.title).toBe('Item 2');
    });

  });

  describe("isMainNavPath", function () {

    it("should return false when path is not used in main navigation", function () {
      // given
      mainNavService.addItem({ title: 'Item 1', href: '/path1' });
      mainNavService.addItem({ title: 'Item 2', href: '/path2' });
      $location.path.and.returnValue('/path3');
      // when
      const result = mainNavService.isMainNavPath();
      // then
      expect(result).toBe(false);
    });

    it("should return true when path is used in main navigation", function () {
      // given
      mainNavService.addItem({ title: 'Item 1', href: '/path1' });
      mainNavService.addItem({ title: 'Item 2', href: '/path2', isValid: () => false });
      $location.path.and.returnValue('/path1');
      // when
      const result = mainNavService.isMainNavPath();
      // then
      expect(result).toBe(true);
    });

    it("should return true when path is used in main navigation, even if item is not valid", function () {
      // given
      mainNavService.addItem({ title: 'Item 1', href: '/path1' });
      mainNavService.addItem({ title: 'Item 2', href: '/path2', isValid: () => false });
      $location.path.and.returnValue('/path2');
      // when
      const result = mainNavService.isMainNavPath();
      // then
      expect(result).toBe(true);
    });

  });

});
