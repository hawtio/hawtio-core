/// <reference path="config-service.ts"/>

describe("Config.ConfigService", function () {

  const CONFIG = {
    branding: {
      name1: "value1",
      name2: "value2"
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

  it("Should return blank when property is not found", function () {
    configService = new Config.ConfigService({});
    let value = configService.getBrandingValue('blah');
    expect(value).toBe('');
  });

  it("Should return value when property is found", function () {
    configService = new Config.ConfigService(CONFIG);
    let value = configService.getBrandingValue('name1');
    expect(value).toBe(CONFIG.branding.name1);
  });
  
});
