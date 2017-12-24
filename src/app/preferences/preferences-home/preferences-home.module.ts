/// <reference path="preferences-home.controller.ts"/>

namespace Core {

  export const preferencesHomeModule = angular
    .module('hawtio-preferences-home', [])
    .controller('PreferencesHomeController', PreferencesHomeController)
    .name;

}
