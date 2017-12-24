/// <reference path="logging-preferences/logging-preferences.module.ts"/>
/// <reference path="preferences-home/preferences-home.module.ts"/>
/// <reference path="reset-preferences/reset-preferences.module.ts"/>
/// <reference path="preferences.config.ts"/>
/// <reference path="preferences.service.ts"/>
/// <reference path="preferences-registry.ts"/>

namespace Core {

  export const preferencesModule = angular
    .module('hawtio-preferences', [
      'ng',
      'ngRoute',
      'ngSanitize',
      loggingPreferencesModule,
      preferencesHomeModule,
      resetPreferencesModule
    ])
    .config(configureRoutes)
    .run(addItemToUserMenu)
    .run(savePreviousLocationWhenOpeningPreferences)
    .run(addHelpDocumentation)
    .run(addPreferencesPages)
    .service('preferencesService', PreferencesService)
    .service('preferencesRegistry', PreferencesRegistry)
    .name;

  hawtioPluginLoader.addModule(preferencesModule);

}
