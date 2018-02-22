/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>
/// <reference path="help-registry.ts"/>

namespace Help {

  export const helpModule = angular
    .module('hawtio-help', [])
    .config(configureRoutes)
    .run(configureDocumentation)
    .run(configureMenu)
    .component('help', helpComponent)
    .service('helpService', HelpService)
    .service('helpRegistry', HelpRegistry)
    .name;

}