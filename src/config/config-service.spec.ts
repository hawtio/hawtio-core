/// <reference path="config-service.ts"/>

describe("Config.ConfigService", function () {

  const CONFIG = {
    branding: {
      logoUrl: "node_modules/patternfly/dist/img/logo.svg",
      logoAltUrl: "node_modules/patternfly/dist/img/logo-alt.svg",
      brandUrl: "node_modules/patternfly/dist/img/brand.svg",
      brandAltUrl: "node_modules/patternfly/dist/img/brand-alt.svg",
      brandName: "PatternFly Enterprise Application"
    }
  };
  let configService: Config.ConfigService;

  it("Should throw error when configuration is undefined", function () {
    try {
      new Config.ConfigService(undefined);
      fail();
    } catch (error) {
    }
  });

  it("Should throw error when configuration is null", function () {
    try {
      new Config.ConfigService(null);
      fail();
    } catch (error) {
    }
  });

  it("Should throw error when configuration is a string", function () {
    try {
      new Config.ConfigService('<html></html>');
      fail();
    } catch (error) {
    }
  });

  it("Should return null when property is not found", function () {
    configService = new Config.ConfigService({});
    let value = configService.getBrandLogoUrl();
    expect(value).toBe(null);
  });

  it("Should return brand logo URL", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandLogoUrl = configService.getBrandLogoUrl();
    expect(configService.getBrandLogoUrl()).toBe(CONFIG.branding.logoUrl);
  });

  it("Should return brand logo alternative URL", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandLogoAltUrl = configService.getBrandLogoAltUrl();
    expect(brandLogoAltUrl).toBe(CONFIG.branding.logoAltUrl);
  });

  it("Should return brand name URL", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandNameUrl = configService.getBrandNameUrl();
    expect(brandNameUrl).toBe(CONFIG.branding.brandUrl);
  });

  it("Should return brand alternative name URL", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandNameAltUrl = configService.getBrandNameAltUrl();
    expect(brandNameAltUrl).toBe(CONFIG.branding.brandAltUrl);
  });

  it("Should return brand name text", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandName = configService.getBrandName();
    expect(brandName).toBe(CONFIG.branding.brandName);
  });

});
