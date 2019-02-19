/// <reference path="help-dropdown.component.ts"/>
/// <reference path="page-header.component.ts"/>
/// <reference path="user-dropdown.component.ts"/>

namespace Page {

  export const pageHeaderModule = angular
    .module('hawtio-page-header', [])
    .component('helpDropdown', helpDropdownComponent)
    .component('pageHeader', pageHeaderComponent)
    .component('userDropdown', userDropdownComponent)
    .name;

}
