/// <reference path="general-preferences/general-preferences.module.ts"/>
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
      genralPreferencesModule,
      loggingPreferencesModule,
      preferencesHomeModule,
      resetPreferencesModule
    ])
    .config(configureRoutes)
    .run(configureMenu)
    .run(savePreviousLocationWhenOpeningPreferences)
    .run(configureDocumentation)
    .run(configurePreferencesPages)
    .service('preferencesService', PreferencesService)
    .service('preferencesRegistry', PreferencesRegistry)
    .name;

}
