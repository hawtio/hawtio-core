/// <reference path="auth.service.ts"/>
/// <reference path="auth.helper.ts"/>

namespace Core {

  export const authModule = angular
    .module('hawtio-core-auth', [])
    .service('authService', AuthService)
    .service('userDetails', AuthService) // remove when all references are gone
    .name;

}
