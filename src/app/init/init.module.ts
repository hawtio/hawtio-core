/// <reference path="init.service.ts"/>

namespace Init {

  export const initModule = angular
    .module('hawtio-init', [])
    .service('initService', InitService)
    .name;

}
