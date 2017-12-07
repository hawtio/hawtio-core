/// <reference path="auth/auth.module.ts"/>
/// <reference path="branding/branding.module.ts"/>
/// <reference path="config/config.module.ts"/>
/// <reference path="core/hawtio-core.ts"/>
/// <reference path="extension/hawtio-extension-service.ts"/>
/// <reference path="navigation/hawtio-core-navigation.ts"/>
/// <reference path="template-cache/hawtio-template-cache.ts"/>

namespace Hawtio {

  export const rootModule = angular
    .module('hawtio', [
      Auth.authModule,
      Branding.brandingModule,
      Config.configModule,
      HawtioCore.pluginName,
      HawtioExtensionService.pluginName,
      HawtioMainNav.pluginName,
      templateCache.pluginName
    ])
    .name;

  hawtioPluginLoader.addModule(rootModule);
  hawtioPluginLoader.addModule("ng");
  hawtioPluginLoader.addModule("ngSanitize");
  hawtioPluginLoader.addModule("ngRoute");
  
}
