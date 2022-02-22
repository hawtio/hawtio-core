/// <reference path="general-preferences.controller.ts"/>
/// <reference path="general-preferences.service.ts"/>

namespace Core {

  export const generalPreferencesModule = angular
    .module('hawtio-general-preferences', [])
    .controller('GeneralPreferencesController', GeneralPreferencesController)
    .service('generalPreferencesService', GeneralPreferencesService)
    .name;

}
