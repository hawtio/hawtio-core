/// <reference path="logging-preferences.controller.ts"/>
/// <reference path="logging-preferences.service.ts"/>

namespace Core {

  export const loggingPreferencesModule = angular
    .module('hawtio-logging-preferences', [])
    .controller('PreferencesLoggingController', LoggingPreferencesController)
    .service('loggingPreferencesService', LoggingPreferencesService)
    .name;

}
