/// <reference path="page-header.component.ts"/>

namespace Nav {

  export const pageHeaderModule = angular
    .module('hawtio-page-header', [])
    .component('pageHeader', pageHeaderComponent)
    .name;

}
