/// <reference path="config-loader.ts"/>
/// <reference path="branding/branding-image.component.ts"/>
/// <reference path="branding/branding-text.component.ts"/>

namespace Core {

  export const EVENT_LOADED = 'hawtio-config-loaded';
  
  export const configModule = angular
    .module('hawtio-config', [])
    .run(configLoader)
    .component('hawtioBrandingImage', brandingImageComponent)
    .component('hawtioBrandingText', brandingTextComponent)
    .name;

}
