/// <reference path="hawtio-tabs/hawtio-tabs.component.ts"/>
/// <reference path="hawtio-tabs-layout/hawtio-tabs-layout.component.ts"/>
/// <reference path="main-nav/main-nav.component.ts"/>
/// <reference path="main-nav/main-nav.service.ts"/>

namespace Nav {

  export const navigationModule = angular
    .module('hawtio-navigation', [])
    .component('hawtioTabs', hawtioTabsComponent)
    .component('hawtioTabsLayout', hawtioTabsLayoutComponent)
    .component('mainNav', mainNavComponent)
    .service('mainNavService', MainNavService)
    .name;

}
