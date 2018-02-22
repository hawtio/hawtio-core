/// <reference path="auth.service.ts"/>
/// <reference path="auth.helper.ts"/>

namespace Core {

  export const authModule = angular
    .module('hawtio-core-auth', [])
    .service('userDetails', AuthService)
    .name;

}
