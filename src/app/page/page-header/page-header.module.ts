/// <reference path="page-header.component.ts"/>

namespace Page {

  export const pageHeaderModule = angular
    .module('hawtio-page-header', [])
    .component('pageHeader', pageHeaderComponent)
    .name;

}
