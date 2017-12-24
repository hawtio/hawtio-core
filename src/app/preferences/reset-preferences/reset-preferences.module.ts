/// <reference path="reset-preferences.controller.ts"/>

namespace Core {

  export const resetPreferencesModule = angular
    .module('hawtio-preferences-menu-item', [])
    .controller('ResetPreferencesController', ResetPreferencesController)
    .name;

}
