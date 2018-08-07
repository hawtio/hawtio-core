/// <reference path="main-nav-item.ts"/>

describe("MainNavItem", function () {

  describe("constructor", function () {

    it("should construct object with default values", function () {
      // given
      const props: Nav.MainNavItemProps = {
        title: 'My Title'
      };
      // when
      let item = new Nav.MainNavItem(props);
      // then
      expect(item.title).toBe('My Title');
      expect(item.href).toBeUndefined();
      expect(item.basePath).toBeUndefined();
      expect(item.template).toBe(Nav.DEFAULT_TEMPLATE);
      expect(item.templateUrl).toBe('my-title.html');
      expect(item.isValid()).toBe(true);
      expect(item.rank).toBe(0);
    });

    it("should construct object with provided values", function () {
      // given
      const props: Nav.MainNavItemProps = {
        title: 'My Title',
        href: '/test/href',
        basePath: '/test/path',
        template: '<my-template></my-template>',
        isValid: () => false,
        rank: 1
      };
      // when
      let item = new Nav.MainNavItem(props);
      // then
      expect(item.title).toBe('My Title');
      expect(item.href).toBe('/test/href');
      expect(item.basePath).toBe('/test/path');
      expect(item.template).toBe('<my-template></my-template>');
      expect(item.templateUrl).toBe('my-title.html');
      expect(item.isValid()).toBe(false);
      expect(item.rank).toBe(1);
    });

  });

});
