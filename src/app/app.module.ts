/// <reference path="auth/auth.module.ts"/>
/// <reference path="common/common.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="config/config-loader.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="event-services/event-services.module.ts"/>
/// <reference path="extension/hawtio-extension.module.ts"/>
/// <reference path="help/help.module.ts"/>
/// <reference path="navigation/hawtio-core-navigation.ts"/>
/// <reference path="preferences/preferences.module.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>

namespace Core {

  export const appModule = angular
    .module('hawtio', [
      'ng',
      'ngRoute',
      'ngSanitize',
      authModule,
      commonModule,
      configModule,
      HawtioCore.pluginName,
      eventServicesModule,
      hawtioExtensionModule,
      helpModule,
      HawtioMainNav.pluginName,
      preferencesModule,
      templateCache.pluginName
    ])
    .name;

  export const log: Logging.Logger = Logger.get(HawtioCore.pluginName);

  hawtioPluginLoader
    .addModule(appModule)
    .registerPreBootstrapTask({
      name: 'HawtioConfigLoader',
      task: configLoader
    });

}
