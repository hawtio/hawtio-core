/// <reference path="config-manager.ts"/>

describe("ConfigService", function () {

  let configManager: Core.ConfigManager;

  describe("getBrandingValue()", function () {

    it("should return branding value when found", function () {
      // given
      configManager = new Core.ConfigManager({branding: {name1: "value1"}});
      // when
      let value = configManager.getBrandingValue('name1');
      // then
      expect(value).toBe('value1');
    });

    it("should return empty string when not found", function () {
      // given
      configManager = new Core.ConfigManager({branding: {name1: "value1"}});
      // when
      let value = configManager.getBrandingValue('name2');
      // then
      expect(value).toBe('');
    });

    it("should return empty string when branding property is undefined", function () {
      // given
      configManager = new Core.ConfigManager({});
      // when
      let value = configManager.getBrandingValue('name1');
      // then
      expect(value).toBe('');
    });

    it("should return empty string when config is undefined", function () {
      // given
      configManager = new Core.ConfigManager(undefined);
      // when
      let value = configManager.getBrandingValue('name1');
      // then
      expect(value).toBe('');
    });

  });

  describe("isRouteEnabled()", function () {

    it("should return true when route is enabled", function () {
      // given
      configManager = new Core.ConfigManager({disabledRoutes: ['/route1']});
      // when
      let routeEnabled = configManager.isRouteEnabled('/route2');
      // then
      expect(routeEnabled).toBe(true);
    });

    it("should return true when disabledRoutes property is undefined", function () {
      // given
      configManager = new Core.ConfigManager({});
      // when
      let routeEnabled = configManager.isRouteEnabled('/route1');
      // then
      expect(routeEnabled).toBe(true);
    });

    it("should return true when config is undefined", function () {
      // given
      configManager = new Core.ConfigManager(undefined);
      // when
      let routeEnabled = configManager.isRouteEnabled('/route1');
      // then
      expect(routeEnabled).toBe(true);
    });

    it("should return false when route is disabled", function () {
      // given
      configManager = new Core.ConfigManager({disabledRoutes: ['/route1']});
      // when
      let routeEnabled = configManager.isRouteEnabled('/route1');
      // then
      expect(routeEnabled).toBe(false);
    });

  });

  describe("online.projectSelector property", function () {

    it("given no projectSelector property it should not fail", function () {
      // given
      configManager = new Core.ConfigManager({online: null});
      // then
      expect(configManager.config.online).toBe(null);
    });

    it("should return the value", function () {
      // given
      configManager = new Core.ConfigManager({online: {projectSelector: "environment=dev,networkzone=internal" }});
      // when
      let value = configManager.config.online.projectSelector;
      // then
      expect(value).toBe('environment=dev,networkzone=internal');
    });

  });

});
