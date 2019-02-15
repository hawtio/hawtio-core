/// <reference path="page-sidebar.component.ts"/>

namespace Nav {

  export const pageSidebarModule = angular
    .module('hawtio-page-sidebar', [])
    .component('pageSidebar', pageSidebarComponent)
    .name;

}
