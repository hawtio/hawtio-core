/// <reference path="help-dropdown.component.ts"/>
/// <reference path="page-header.component.ts"/>

namespace Page {

  export const pageHeaderModule = angular
    .module('hawtio-page-header', [])
    .component('helpDropdown', helpDropdownComponent)
    .component('pageHeader', pageHeaderComponent)
    .name;

}
