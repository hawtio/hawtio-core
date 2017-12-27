/// <reference path="config-service.ts"/>

describe("ConfigService", function () {

  const CONFIG = {
    branding: {
      name1: "value1",
      name2: "value2"
    }
  };
  let configService: Core.ConfigService;

  it("Should throw error when configuration is undefined", function () {
    try {
      new Core.ConfigService(undefined);
      fail();
    } catch (error) {
    }
  });

  it("Should throw error when configuration is null", function () {
    try {
      new Core.ConfigService(null);
      fail();
    } catch (error) {
    }
  });

  it("Should throw error when configuration is a string", function () {
    try {
      new Core.ConfigService('<html></html>');
      fail();
    } catch (error) {
    }
  });

  it("Should return blank when property is not found", function () {
    configService = new Core.ConfigService({});
    let value = configService.getBrandingValue('blah');
    expect(value).toBe('');
  });

  it("Should return value when property is found", function () {
    configService = new Core.ConfigService(CONFIG);
    let value = configService.getBrandingValue('name1');
    expect(value).toBe(CONFIG.branding.name1);
  });
  
});
