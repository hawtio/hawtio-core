/// <reference path="branding-image.component.ts"/>
/// <reference path="branding-text.component.ts"/>

namespace Branding {

  export const log = Logger.get('hawtio-branding');

  export const brandingModule = angular
    .module('hawtio-branding', [])
    .component('hawtioBrandingImage', brandingImageComponent)
    .component('hawtioBrandingText', brandingTextComponent)
    .name;

}
