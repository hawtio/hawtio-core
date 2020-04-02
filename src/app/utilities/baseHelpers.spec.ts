/// <reference path="baseHelpers.ts"/>

describe("Core.baseHelpers", function () {

  describe("trimQuotes()", function () {

    it("should only trim enclosing quotes", function () {
      expect(Core.trimQuotes('"0.0.0.0"')).toBe('0.0.0.0');
      expect(Core.trimQuotes("'0.0.0.0'")).toBe('0.0.0.0');
      expect(Core.trimQuotes("CodeHeap 'non-nmethods'")).toBe("CodeHeap 'non-nmethods'");
      expect(Core.trimQuotes('CodeHeap "non-nmethods"')).toBe('CodeHeap "non-nmethods"');
    });

    it("should not cause exception when null is passed", function () {
      expect(Core.trimQuotes(null)).toBeNull();
    });

  });

});
