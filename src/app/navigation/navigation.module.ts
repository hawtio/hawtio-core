/// <reference path="hawtio-tabs/hawtio-tabs.component.ts"/>
/// <reference path="hawtio-tabs-layout/hawtio-tabs-layout.component.ts"/>
/// <reference path="main-nav/main-nav.component.ts"/>
/// <reference path="main-nav/main-nav.service.ts"/>
/// <reference path="page-header/page-header.module.ts"/>
/// <reference path="page-main/page-main.module.ts"/>
/// <reference path="page-sidebar/page-sidebar.module.ts"/>
/// <reference path="page.component.ts"/>

namespace Nav {

  export const navigationModule = angular
    .module('hawtio-navigation', [
      pageHeaderModule,
      pageMainModule,
      pageSidebarModule
    ])
    .component('hawtioTabs', hawtioTabsComponent)
    .component('hawtioTabsLayout', hawtioTabsLayoutComponent)
    .component('mainNav', mainNavComponent)
    .service('mainNavService', MainNavService)
    .component('page', pageComponent)
    .name;

}
