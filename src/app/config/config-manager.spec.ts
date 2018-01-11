/// <reference path="config-manager.ts"/>

describe("ConfigService", function () {

  const CONFIG = {
    branding: {
      name1: "value1",
      name2: "value2"
    },
    disabledRoutes: [
      "/path1",
      "/path2"
    ]
  };
  
  let configManager: Core.ConfigManager;
  let $routeProvider;

  beforeEach(function() {
    $routeProvider = jasmine.createSpyObj('$routeProvider', ['when']);
  });

  describe("getBrandingValue()", function () {

    it("should return branding value when found", function () {
      // given
      configManager = new Core.ConfigManager({branding: {name1: "value1"}}, $routeProvider);
      // when
      let value = configManager.getBrandingValue('name1');
      // then
      expect(value).toBe('value1');
    });
    
    it("should return empty string when not found", function () {
      // given
      configManager = new Core.ConfigManager({branding: {name1: "value1"}}, $routeProvider);
      // when
      let value = configManager.getBrandingValue('name2');
      // then
      expect(value).toBe('');
    });

    it("should return empty string when branding property is undefined", function () {
      // given
      configManager = new Core.ConfigManager({}, $routeProvider);
      // when
      let value = configManager.getBrandingValue('name1');
      // then
      expect(value).toBe('');
    });

    it("should return empty string when config is undefined", function () {
      // given
      configManager = new Core.ConfigManager(undefined, $routeProvider);
      // when
      let value = configManager.getBrandingValue('name1');
      // then
      expect(value).toBe('');
    });

  });

  describe("isRouteEnabled()", function () {
  
    it("should return true when route is enabled", function () {
      // given
      configManager = new Core.ConfigManager({disabledRoutes: ['/route1']}, $routeProvider);
      // when
      let routeEnabled = configManager.isRouteEnabled('/route2');
      // then
      expect(routeEnabled).toBe(true);
    });

    it("should return true when disabledRoutes property is undefined", function () {
      // given
      configManager = new Core.ConfigManager({}, $routeProvider);
      // when
      let routeEnabled = configManager.isRouteEnabled('/route1');
      // then
      expect(routeEnabled).toBe(true);
    });
    
    it("should return true when config is undefined", function () {
      // given
      configManager = new Core.ConfigManager(undefined, $routeProvider);
      // when
      let routeEnabled = configManager.isRouteEnabled('/route1');
      // then
      expect(routeEnabled).toBe(true);
    });
    
    it("should return false when route is disabled", function () {
      // given
      configManager = new Core.ConfigManager({disabledRoutes: ['/route1']}, $routeProvider);
      // when
      let routeEnabled = configManager.isRouteEnabled('/route1');
      // then
      expect(routeEnabled).toBe(false);
    });

  });

  describe("addRoute()", function () {
  
    it("should add route when route is enabled", function () {
      // given
      const path = '/path1';
      const route = {template: ''};
      configManager = new Core.ConfigManager({disabledRoutes: []}, $routeProvider);
      // when
      configManager.addRoute(path, route);
      // then
      expect($routeProvider.when).toHaveBeenCalledWith(path, route);
    });

    it("should not add route when route is disabled", function () {
      // given
      const path = '/path1';
      const route = {template: ''};
      configManager = new Core.ConfigManager({disabledRoutes: [path]}, $routeProvider);
      // when
      configManager.addRoute(path, route);
      // then
      expect($routeProvider.when).not.toHaveBeenCalled();
    });

  });
  
});
