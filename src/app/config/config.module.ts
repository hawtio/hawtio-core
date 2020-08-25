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
    .run(applyBranding)
    .name;

  function initConfigManager($provide: ng.auto.IProvideService): void {
    'ngInject';
    const config: Config = window['hawtconfig'];
    const configManager = new ConfigManager(config);
    $provide.constant('configManager', configManager);
    delete window['hawtconfig'];
  }

  export function applyBranding(configManager: ConfigManager): void {
    'ngInject';
    let branding = configManager.branding;
    if (!branding) {
      return;
    }
    if (branding.appName) {
      log.info('Updating title', '-', branding.appName);
      document.title = branding.appName;
    }
    if (branding.css) {
      updateHref('#branding', branding.css);
    }
    if (branding.favicon) {
      updateHref('#favicon', branding.favicon);
    }
  }

  function updateHref(id: string, path: string): void {
    log.info('Updating href for', id, '-', path);
    let elm = $(id);
    elm.prop('disabled', true);
    elm.attr({ href: path });
    elm.prop('disabled', false);
  }

}
