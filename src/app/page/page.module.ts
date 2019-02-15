/// <reference path="page-header/page-header.module.ts"/>
/// <reference path="page-main/page-main.module.ts"/>
/// <reference path="page-sidebar/page-sidebar.module.ts"/>
/// <reference path="page.component.ts"/>

namespace Page {

  export const pageModule = angular
    .module('hawtio-page', [
      pageHeaderModule,
      pageMainModule,
      pageSidebarModule
    ])
    .component('page', pageComponent)
    .name;

}
