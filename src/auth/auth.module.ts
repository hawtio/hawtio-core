/// <reference path="auth.service.ts"/>

namespace Auth {

  export const log = Logger.get('hawtio-auth');

  export const authModule = angular
    .module('hawtio-auth', [])
    .service('authService', DummyAuthService)
    .name;

}
