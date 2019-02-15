/// <reference path="page-main.component.ts"/>

namespace Nav {

  export const pageMainModule = angular
    .module('hawtio-page-main', [])
    .component('pageMain', pageMainComponent)
    .name;

}
