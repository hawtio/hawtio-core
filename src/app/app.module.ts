/// <reference path="auth/auth.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="config/config-loader.ts"/>
/// <reference path="core/core.module.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="event-services/event-services.module.ts"/>
/// <reference path="extension/hawtio-extension.module.ts"/>
/// <reference path="help/help.module.ts"/>
/// <reference path="navigation/hawtio-core-navigation.ts"/>
/// <reference path="preferences/preferences.module.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>
/// <reference path="app.component.ts"/>

namespace App {

  export const appModule = angular
    .module('hawtio', [
      'ng',
      'ngRoute',
      'ngSanitize',
      'patternfly',
      'patternfly.modals',
      'patternfly.table',
      'patternfly.toolbars',
      Core.authModule,
      Core.configModule,
      Core.coreModule,
      Core.eventServicesModule,
      Core.hawtioExtensionModule,
      Help.helpModule,
      Nav.pluginName,
      Core.preferencesModule,
      templateCache.pluginName
    ])
    .component('hawtioApp', appComponent)
    .name;

  hawtioPluginLoader
    .addModule(appModule)
    .registerPreBootstrapTask({
      name: 'ConfigLoader',
      task: Core.configLoader
    });

}
