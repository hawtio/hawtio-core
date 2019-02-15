/// <reference path="page-main.component.ts"/>

namespace Page {

  export const pageMainModule = angular
    .module('hawtio-page-main', [])
    .component('pageMain', pageMainComponent)
    .name;

}
