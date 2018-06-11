/// <reference path="about/about.module.ts"/>
/// <reference path="auth/auth.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="config/config-loader.ts"/>
/// <reference path="core/core.module.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="event-services/event-services.module.ts"/>
/// <reference path="extension/hawtio-extension.module.ts"/>
/// <reference path="help/help.module.ts"/>
/// <reference path="init/init.module.ts"/>
/// <reference path="navigation/navigation.module.ts"/>
/// <reference path="preferences/preferences.module.ts"/>
/// <reference path="shared/shared.module.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>
/// <reference path="app.config.ts"/>
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
      About.aboutModule,
      Core.authModule,
      Core.configModule,
      Core.coreModule,
      Core.eventServicesModule,
      Core.hawtioExtensionModule,
      Core.preferencesModule,
      Core.templateCacheModule,
      Help.helpModule,
      Init.initModule,
      Nav.navigationModule,
      Shared.sharedModule
    ])
    .run(configureAboutPage)
    .component('hawtioApp', appComponent)
    .name;

  hawtioPluginLoader
    .addModule(appModule)
    .registerPreBootstrapTask({
      name: 'ConfigLoader',
      task: Core.configLoader
    });

}
