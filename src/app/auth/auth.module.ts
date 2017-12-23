/// <reference path="auth.service.ts"/>

namespace Core {

  export const authModule = angular
    .module('hawtio-auth', [])
    .service('authService', DummyAuthService)
    .name;

}
