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

});
