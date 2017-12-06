/// <reference path="config-service.ts"/>

describe("Config.ConfigService", function () {

  const CONFIG = {
    brand: {
      logoUrl: "node_modules/patternfly/dist/img/logo-alt.svg",
      nameUrl: "node_modules/patternfly/dist/img/brand-alt.svg",
      nameText: "PatternFly Enterprise Application"
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
    expect(brandLogoUrl).toBe(CONFIG.brand.logoUrl);
  });

  it("Should return brand name URL", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandNameUrl = configService.getBrandNameUrl();
    expect(brandNameUrl).toBe(CONFIG.brand.nameUrl);
  });

  it("Should return brand name text", function () {
    configService = new Config.ConfigService(CONFIG);
    let brandNameText = configService.getBrandNameText();
    expect(brandNameText).toBe(CONFIG.brand.nameText);
  });

});
