/// <reference path="app-launcher/app-launcher.component.ts"/>
/// <reference path="context-selector/context-selector.component.ts"/>
/// <reference path="hawtio-tabs/hawtio-tabs.component.ts"/>
/// <reference path="hawtio-tabs-layout/hawtio-tabs-layout.component.ts"/>
/// <reference path="help-dropdown/help-dropdown.component.ts"/>
/// <reference path="user-dropdown/user-dropdown.component.ts"/>
/// <reference path="main-nav/main-nav.service.ts"/>

namespace Nav {

  export const navigationModule = angular
    .module('hawtio-navigation', [])
    .component('appLauncher', appLauncherComponent)
    .component('contextSelector', contextSelectorComponent)
    .component('hawtioTabs', hawtioTabsComponent)
    .component('hawtioTabsLayout', hawtioTabsLayoutComponent)
    .component('helpDropdown', helpDropdownComponent)
    .component('userDropdown', userDropdownComponent)
    .service('mainNavService', MainNavService)
    .name;

}
