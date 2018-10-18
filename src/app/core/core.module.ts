/// <reference path="humanize/humanize.service.ts"/>
/// <reference path="patternfly/patternfly.service.ts"/>

namespace Core {

  export const _module = angular
    .module('hawtio-core', [])
    .service('humanizeService', HumanizeService)
    .service('patternFlyService', PatternFlyService);

  export const coreModule = _module.name;

  export const log: Logging.Logger = Logger.get(coreModule);

}
