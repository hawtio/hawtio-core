/// <reference path="brand-logo.component.ts"/>
/// <reference path="brand-name.component.ts"/>

namespace Branding {

  export const log = Logger.get('hawtio-branding');

  export const brandingModule = angular
    .module('hawtio-branding', [])
    .component('hawtioBrandLogo', brandLogoComponent)
    .component('hawtioBrandName', brandNameComponent)
    .name;

}
