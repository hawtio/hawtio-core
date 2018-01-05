/// <reference path="humanize.service.ts"/>

describe("HumanizeService", function () {

  const humanizeService = new Core.HumanizeService();

  it("should humanize string in upper case", function () {
    // given
    const strings = ['outOfService', 'out-of-service', 'OUT_OF_SERVICE'];
    // when
    const results = strings.map(str => humanizeService.toUpperCase(str));
    // then
    results.forEach(result => expect(result).toEqual('OUT OF SERVICE'));
  });

  it("should humanize string in lower case", function () {
    // given
    const strings = ['outOfService', 'out-of-service', 'OUT_OF_SERVICE'];
    // when
    const results = strings.map(str => humanizeService.toLowerCase(str));
    // then
    results.forEach(result => expect(result).toEqual('out of service'));
  });

  it("should humanize string in sentence case", function () {
    // given
    const strings = ['outOfService', 'out-of-service', 'OUT_OF_SERVICE'];
    // when
    const results = strings.map(str => humanizeService.toSentenceCase(str));
    // then
    results.forEach(result => expect(result).toEqual('Out of service'));
  });

  it("should humanize string in title case", function () {
    // given
    const strings = ['outOfService', 'out-of-service', 'OUT_OF_SERVICE'];
    // when
    const results = strings.map(str => humanizeService.toTitleCase(str));
    // then
    results.forEach(result => expect(result).toEqual('Out Of Service'));
  });
 
});
