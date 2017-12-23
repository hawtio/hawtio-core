/// <reference path="help.component.ts"/>
/// <reference path="help.config.ts"/>
/// <reference path="help.service.ts"/>
/// <reference path="help-registry.service.ts"/>

namespace Core {

  export const helpModule = angular
    .module('hawtio-help', [])
    .config(HelpConfig)
    .run(HelpRun)
    .component('help', helpComponent)
    .service('helpService', HelpService)
    .service('helpRegistry', HelpRegistryService)
    .name;

}