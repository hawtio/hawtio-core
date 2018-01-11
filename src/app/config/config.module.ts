/// <reference path="branding/branding-image.component.ts"/>
/// <reference path="branding/branding-text.component.ts"/>
/// <reference path="config.ts"/>
/// <reference path="config-manager.ts"/>

namespace Core {

  export const configModule = angular
    .module('hawtio-config', [])
    .config(($provide: ng.auto.IProvideService, $routeProvider: ng.route.IRouteProvider) => {
      const config: Config = window['hawtconfig'];
      const configManager = new ConfigManager(config, $routeProvider);
      $provide.constant('configManager', configManager);
      delete window['hawtconfig'];
    })
    .component('hawtioBrandingImage', brandingImageComponent)
    .component('hawtioBrandingText', brandingTextComponent)
    .name;

}
