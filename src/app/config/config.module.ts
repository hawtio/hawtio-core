/// <reference path="branding/branding-image.component.ts"/>
/// <reference path="branding/branding-text.component.ts"/>
/// <reference path="config.ts"/>
/// <reference path="config-manager.ts"/>

namespace Core {

  export const configModule = angular
    .module('hawtio-config', [])
    .config(initConfigManager)
    .component('hawtioBrandingImage', brandingImageComponent)
    .component('hawtioBrandingText', brandingTextComponent)
    .name;

  function initConfigManager($provide: ng.auto.IProvideService): void {
    'ngInject';
    const config: Config = window['hawtconfig'];
    const configManager = new ConfigManager(config);
    $provide.constant('configManager', configManager);
    delete window['hawtconfig'];
  }

}
