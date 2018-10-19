/// <reference path="auth.service.ts"/>

describe("AuthService", function () {

  let authService: Core.AuthService;
  let postLoginTasks: Core.Tasks;
  let preLogoutTasks: Core.Tasks;
  let postLogoutTasks: Core.Tasks;

  beforeEach(function () {
    postLoginTasks = jasmine.createSpyObj('postLoginTasks', ['execute']);
    preLogoutTasks = jasmine.createSpyObj('preLogoutTasks', ['execute']);
    postLogoutTasks = jasmine.createSpyObj('postLogoutTasks', ['execute']);
    authService = new Core.AuthService(postLoginTasks, preLogoutTasks, postLogoutTasks);
  });

  describe("isDefaultUser()", function () {

    it("should return true when user is default user", function () {
      // when
      let isDefaultUser = authService.isDefaultUser();
      // then
      expect(isDefaultUser).toBe(true);
    });

    it("should return false when user is not default user", function () {
      // given
      authService.login('bob', 'password');
      // when
      let isDefaultUser = authService.isDefaultUser();
      // then
      expect(isDefaultUser).toBe(false);
    });

  });

});
