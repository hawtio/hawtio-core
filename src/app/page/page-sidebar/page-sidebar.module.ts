/// <reference path="page-sidebar.component.ts"/>

namespace Page {

  export const pageSidebarModule = angular
    .module('hawtio-page-sidebar', [])
    .component('pageSidebar', pageSidebarComponent)
    .name;

}
