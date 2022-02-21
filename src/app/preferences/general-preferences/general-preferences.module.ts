/// <reference path="general-preferences.controller.ts"/>
/// <reference path="general-preferences.service.ts"/>

namespace Core {

    export const genralPreferencesModule = angular
      .module('hawtio-general-preferences', [])
      .controller('PreferencesGeneralController', GeneralPreferencesController)
      .service('generalPreferencesService',GeneralPreferencesService)
      .name;
  
  }
  